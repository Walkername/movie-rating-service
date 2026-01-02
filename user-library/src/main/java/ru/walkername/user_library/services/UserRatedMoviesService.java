package ru.walkername.user_library.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.data.elasticsearch.core.mapping.IndexCoordinates;
import org.springframework.data.elasticsearch.core.query.*;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.retry.support.RetryTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import ru.walkername.user_library.dto.MovieResponse;
import ru.walkername.user_library.dto.PageResponse;
import ru.walkername.user_library.dto.UserRatedMovieResponse;
import ru.walkername.user_library.events.*;
import ru.walkername.user_library.exceptions.UserRatedMovieNotFound;
import ru.walkername.user_library.models.UserRatedMovie;
import ru.walkername.user_library.repositories.UserRatedMoviesRepository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class UserRatedMoviesService {

    private final UserRatedMoviesRepository userRatedMoviesRepository;
    private final RestTemplate restTemplate;

    private final String MOVIE_CATALOG_SERVICE_API;
    private final ElasticsearchOperations elasticsearchOperations;

    private final IndexCoordinates indexCoordinates;
    private final RetryTemplate retryTemplate;

    @Autowired
    public UserRatedMoviesService(
            UserRatedMoviesRepository userRatedMoviesRepository,
            RestTemplate restTemplate,
            @Value("${movie-catalog.service.url}") String MOVIE_CATALOG_SERVICE_API,
            ElasticsearchOperations elasticsearchOperations,
            @Value("${spring.elasticsearch.index.user-rated-movies}")
            String indexName,
            RetryTemplate retryTemplate) {
        this.userRatedMoviesRepository = userRatedMoviesRepository;
        this.restTemplate = restTemplate;
        this.MOVIE_CATALOG_SERVICE_API = MOVIE_CATALOG_SERVICE_API;
        this.elasticsearchOperations = elasticsearchOperations;
        this.indexCoordinates = IndexCoordinates.of(indexName);
        this.retryTemplate = retryTemplate;
    }

    @KafkaListener(
            topics = "ratings-created",
            groupId = "user-library-group",
            containerFactory = "ratingCreatedContainerFactory"
    )
    public void handleRatingCreated(RatingCreated ratingCreated) {
        System.out.println("RatingCreated: movieId=" + ratingCreated.getMovieId());
        // Getting movie data
        String movieCatalogEndpoint = MOVIE_CATALOG_SERVICE_API + "/movies/" + ratingCreated.getMovieId();
        MovieResponse movieResponse = restTemplate.getForObject(movieCatalogEndpoint, MovieResponse.class);

        if (movieResponse == null) {
            throw new UserRatedMovieNotFound("Could not find movie with id: " + ratingCreated.getMovieId());
        }

        UserRatedMovie userRatedMovie = new UserRatedMovie(
                UserRatedMovie.generateId(ratingCreated.getUserId(), ratingCreated.getMovieId()),
                ratingCreated.getUserId(),
                ratingCreated.getMovieId(),
                ratingCreated.getRating(),
                ratingCreated.getRatedAt(),
                movieResponse.getTitle(),
                movieResponse.getReleaseYear(),
                movieResponse.getAverageRating(),
                movieResponse.getScores(),
                movieResponse.getCreatedAt()
        );

        retryTemplate.execute(context -> {
            userRatedMoviesRepository.save(userRatedMovie);
            return null;
        });
    }

    @KafkaListener(
            topics = "ratings-updated",
            groupId = "user-library-group",
            containerFactory = "ratingUpdatedContainerFactory"
    )
    public void handleRatingUpdated(RatingUpdated ratingUpdated) {
        System.out.println("RatingUpdated: movieId=" + ratingUpdated.getMovieId());

        String docId = UserRatedMovie.generateId(ratingUpdated.getUserId(), ratingUpdated.getMovieId());
        Map<String, Object> params = new HashMap<>();
        params.put("rating", ratingUpdated.getRating());
        params.put("ratedAt", ratingUpdated.getRatedAt());

        String script = """
                    if (ctx._source.rating != params.rating) {
                        ctx._source.rating = params.rating;
                    }
                    if (ctx._source.ratedAt != params.ratedAt) {
                        ctx._source.ratedAt = params.ratedAt;
                    }
                """;

        try {
            updateWithScript(docId, params, script);
        } catch (Exception e) {
            updateUserRatingWithFullDocument(docId, ratingUpdated);
        }
    }

    @KafkaListener(
            topics = "ratings-deleted",
            groupId = "user-library-group",
            containerFactory = "ratingDeletedContainerFactory"
    )
    public void handleRatingDeleted(RatingDeleted ratingDeleted) {
        String docId = UserRatedMovie.generateId(ratingDeleted.getUserId(), ratingDeleted.getMovieId());
        System.out.println("RatingDeleted: movieId=" + ratingDeleted.getMovieId());

        Map<String, Object> params = new HashMap<>();
        params.put("deleted", true);

        String script = """
                    if (ctx._source.deleted != params.deleted) {
                        ctx._source.deleted = params.deleted;
                    }
                """;

        try {
            updateWithScript(docId, params, script);
        } catch (Exception e) {
            updateRatingDeletedWithFullDocument(docId);
        }
    }

    private void updateWithScript(String docId, Map<String, Object> params, String script) {
        UpdateQuery updateQuery = UpdateQuery.builder(docId)
                .withScriptType(ScriptType.INLINE)
                .withScript(script)
                .withParams(params)
                .build();

        elasticsearchOperations.update(updateQuery, indexCoordinates);
    }

    private void updateUserRatingWithFullDocument(String docId, RatingUpdated ratingUpdated) {
        UserRatedMovie existingDoc = userRatedMoviesRepository.findById(docId)
                .orElseThrow(() -> new UserRatedMovieNotFound("Document not found: " + docId));

        existingDoc.setRating(ratingUpdated.getRating());
        existingDoc.setRatedAt(ratingUpdated.getRatedAt());

        retryTemplate.execute(context -> {
            userRatedMoviesRepository.save(existingDoc);
            return null;
        });
    }

    private void updateRatingDeletedWithFullDocument(String docId) {
        UserRatedMovie existingDoc = userRatedMoviesRepository.findById(docId)
                .orElseThrow(() -> new UserRatedMovieNotFound("Document not found: " + docId));

        existingDoc.setDeleted(true);

        retryTemplate.execute(context -> {
            userRatedMoviesRepository.save(existingDoc);
            return null;
        });
    }

    @KafkaListener(
            topics = "movies-updated",
            groupId = "user-library-group",
            containerFactory = "movieUpdatedContainerFactory"
    )
    public void handleMovieUpdated(MovieUpdated movieUpdated) {
        System.out.println("MovieUpdated: movieId=" + movieUpdated.getId());

        Criteria criteria = new Criteria("movieId").is(movieUpdated.getId());
        CriteriaQuery query = new CriteriaQuery(criteria);

        Map<String, Object> params = new HashMap<>();
        params.put("title", movieUpdated.getTitle());
        params.put("releaseYear", movieUpdated.getReleaseYear());

        String script = """
                    if (ctx._source.movieTitle != params.title) {
                        ctx._source.movieTitle = params.title;
                    }
                    if (ctx._source.movieReleaseYear != params.releaseYear) {
                        ctx._source.movieReleaseYear = params.releaseYear;
                    }
                """;

        UpdateQuery updateQuery = UpdateQuery.builder(query)
                .withScriptType(ScriptType.INLINE)
                .withScript(script)
                .withParams(params)
                .build();

        retryTemplate.execute(context -> {
            elasticsearchOperations.updateByQuery(updateQuery, indexCoordinates);
            return null;
        });
    }

    @KafkaListener(
            topics = "movies-rating-updated",
            groupId = "user-library-group",
            containerFactory = "movieRatingUpdatedContainerFactory"
    )
    public void handleMovieRatingUpdated(MovieRatingUpdated movieRatingUpdated) {
        System.out.println("MovieRatingUpdated: movieId=" + movieRatingUpdated.getId());

        Criteria criteria = new Criteria("movieId").is(movieRatingUpdated.getId());
        CriteriaQuery query = new CriteriaQuery(criteria);

        Map<String, Object> params = new HashMap<>();
        params.put("averageRating", movieRatingUpdated.getAverageRating());
        params.put("scores", movieRatingUpdated.getScores());

        String script = """
                    if (ctx._source.movieAverageRating != params.averageRating) {
                        ctx._source.movieAverageRating = params.averageRating;
                    }
                    if (ctx._source.movieScores != params.scores) {
                        ctx._source.movieScores = params.scores;
                    }
                """;

        UpdateQuery updateQuery = UpdateQuery.builder(query)
                .withScriptType(ScriptType.INLINE)
                .withScript(script)
                .withParams(params)
                .build();

        retryTemplate.execute(context -> {
            elasticsearchOperations.updateByQuery(updateQuery, indexCoordinates);
            return null;
        });
    }

    @KafkaListener(
            topics = "movies-deleted",
            groupId = "user-library-group",
            containerFactory = "movieDeletedContainerFactory"
    )
    public void handleMovieDeleted(MovieDeleted movieDeleted) {
        System.out.println("MovieDeleted: movieId=" + movieDeleted.getMovieId());

        Criteria criteria = new Criteria("movieId").is(movieDeleted.getMovieId());
        CriteriaQuery criteriaQuery = new CriteriaQuery(criteria);
        DeleteQuery deleteQuery = DeleteQuery.builder(criteriaQuery).build();

        retryTemplate.execute(context -> {
            elasticsearchOperations.delete(deleteQuery, UserRatedMovie.class);
            return null;
        });
    }

    public PageResponse<UserRatedMovieResponse> getUserRatedMovies(
            Long userId,
            int page,
            int limit,
            String sort,
            Double minRating
    ) {
        Criteria criteria = new Criteria("userId").is(userId).and("deleted").is(false);

        if (minRating != null) {
            criteria = criteria.and(new Criteria("rating").greaterThanEqual(minRating));
        }

        Sort sortObj = parseSort(sort);

        PageRequest pageRequest = PageRequest.of(page, limit, sortObj);

        CriteriaQuery query = new CriteriaQuery(criteria).setPageable(pageRequest);

        SearchHits<UserRatedMovie> hits = elasticsearchOperations.search(query, UserRatedMovie.class, indexCoordinates);

        List<UserRatedMovieResponse> responses = hits.getSearchHits().stream()
                .map(hit -> toResponse(hit.getContent()))
                .toList();

        long totalHits = hits.getTotalHits();

        return new PageResponse<>(
                responses,
                page,
                limit,
                totalHits,
                (int) Math.ceil((double) totalHits / limit)
        );
    }

    private Sort parseSort(String sort) {
        if (sort.isBlank()) {
            return Sort.by(Sort.Order.asc("ratedAt"));
        }

        String[] sortElements = sort.split(":");
        String fieldSort = sortElements[0];
        String sortDirection = sortElements[1];

        if (sortDirection.equals("asc")) {
            return Sort.by(fieldSort).ascending();
        } else {
            return Sort.by(fieldSort).descending();
        }
    }

    private UserRatedMovieResponse toResponse(UserRatedMovie doc) {
        return new UserRatedMovieResponse(
                doc.getId(),
                doc.getUserId(),
                doc.getMovieId(),
                doc.getRating(),
                doc.getRatedAt(),
                doc.getMovieTitle(),
                doc.getMovieReleaseYear(),
                doc.getMovieAverageRating(),
                doc.getMovieScores(),
                doc.getMovieCreatedAt()
        );
    }

    public PageResponse<UserRatedMovieResponse> searchUserRatedMoviesByTitle(Long userId, String query) {
        int page = 0;
        int limit = 10;
        PageRequest pageRequest = PageRequest.of(page, limit);

        var prefixQuery = QueryBuilders
                .prefix(p -> p
                        .field("movieTitle")
                        .value(query.toLowerCase())
                );

        var fuzzyQuery = QueryBuilders
                .match(m -> m
                        .field("movieTitle")
                        .query(query)
                        .fuzziness("auto")
                        .operator(Operator.Or)
                );

        var wildcardQuery = QueryBuilders
                .wildcard(w -> w
                        .field("movieTitle")
                        .value("*" + query.toLowerCase() + "*")
                );

        var boolQuery = QueryBuilders
                .bool(b -> b
                        .should(prefixQuery)
                        .should(fuzzyQuery)
                        .should(wildcardQuery)
                        .minimumShouldMatch("1")
                        .filter(f -> f.term(t -> t.field("userId").value(userId)))
                        .filter(f -> f.term(t -> t.field("deleted").value(false)))
                );

        Query nativeQuery = new NativeQueryBuilder()
                .withQuery(boolQuery)
                .withPageable(pageRequest)
                .build();

        SearchHits<UserRatedMovie> hits = elasticsearchOperations.search(nativeQuery, UserRatedMovie.class, indexCoordinates);

        List<UserRatedMovieResponse> responses = hits.getSearchHits().stream()
                .map(hit -> toResponse(hit.getContent()))
                .toList();

        long totalHits = hits.getTotalHits();

        return new PageResponse<>(
                responses,
                page,
                limit,
                totalHits,
                (int) Math.ceil((double) totalHits / limit)
        );
    }

}
