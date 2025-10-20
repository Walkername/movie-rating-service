package ru.walkername.user_library.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.data.elasticsearch.core.query.Criteria;
import org.springframework.data.elasticsearch.core.query.CriteriaQuery;
import org.springframework.kafka.annotation.KafkaListener;
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
import java.util.List;

@Service
public class UserRatedMoviesService {

    private final UserRatedMoviesRepository userRatedMoviesRepository;
    private final RestTemplate restTemplate;

    private final String MOVIE_CATALOG_SERVICE_API;
    private final ElasticsearchOperations elasticsearchOperations;

    @Autowired
    public UserRatedMoviesService(
            UserRatedMoviesRepository userRatedMoviesRepository,
            RestTemplate restTemplate,
            @Value("${movie-catalog.service.url}") String MOVIE_CATALOG_SERVICE_API,
            ElasticsearchOperations elasticsearchOperations) {
        this.userRatedMoviesRepository = userRatedMoviesRepository;
        this.restTemplate = restTemplate;
        this.MOVIE_CATALOG_SERVICE_API = MOVIE_CATALOG_SERVICE_API;
        this.elasticsearchOperations = elasticsearchOperations;
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

        userRatedMoviesRepository.save(userRatedMovie);
    }

    @KafkaListener(
            topics = "ratings-updated",
            groupId = "user-library-group",
            containerFactory = "ratingUpdatedContainerFactory"
    )
    public void handleRatingUpdated(RatingUpdated ratingUpdated) {
        System.out.println("RatingUpdated: movieId=" + ratingUpdated.getMovieId());
        String userRatedMovieId = UserRatedMovie.generateId(ratingUpdated.getUserId(), ratingUpdated.getMovieId());
        UserRatedMovie userRatedMovie = userRatedMoviesRepository
                .findById(userRatedMovieId)
                .orElseThrow(() -> new UserRatedMovieNotFound("Could not find element with these user and movie ids"));

        userRatedMovie.setRating(ratingUpdated.getRating());
        userRatedMovie.setRatedAt(ratingUpdated.getRatedAt());

        userRatedMoviesRepository.save(userRatedMovie);
    }

    @KafkaListener(
            topics = "ratings-deleted",
            groupId = "user-library-group",
            containerFactory = "ratingDeletedContainerFactory"
    )
    public void handleRatingDeleted(RatingDeleted ratingDeleted) {
        String id = UserRatedMovie.generateId(ratingDeleted.getUserId(), ratingDeleted.getMovieId());
        System.out.println("RatingDeleted: movieId=" + ratingDeleted.getMovieId());
        userRatedMoviesRepository.deleteById(id);
    }

    @KafkaListener(
            topics = "movies-updated",
            groupId = "user-library-group",
            containerFactory = "movieUpdatedContainerFactory"
    )
    public void handleMovieUpdated(MovieUpdated movieUpdated) {
        System.out.println("MovieUpdated: movieId=" + movieUpdated.getId());
        List<UserRatedMovie> userRatedMovies = userRatedMoviesRepository.findByMovieId(movieUpdated.getId());
        if (userRatedMovies.isEmpty()) {
            throw new UserRatedMovieNotFound("Could not find any movie with id" + movieUpdated.getId());
        }

        for (UserRatedMovie userRatedMovie : userRatedMovies) {
            userRatedMovie.setMovieTitle(movieUpdated.getTitle());
            userRatedMovie.setMovieReleaseYear(movieUpdated.getReleaseYear());
        }

        userRatedMoviesRepository.saveAll(userRatedMovies);
    }

    @KafkaListener(
            topics = "movies-rating-updated",
            groupId = "user-library-group",
            containerFactory = "movieRatingUpdatedContainerFactory"
    )
    public void handleMovieRatingUpdated(MovieRatingUpdated movieRatingUpdated) {
        System.out.println("MovieRatingUpdated: movieId=" + movieRatingUpdated.getId());
        List<UserRatedMovie> userRatedMovies = userRatedMoviesRepository.findByMovieId(movieRatingUpdated.getId());
        if (userRatedMovies.isEmpty()) {
            throw new UserRatedMovieNotFound("Could not find movie with id" + movieRatingUpdated.getId());
        }

        for (UserRatedMovie userRatedMovie : userRatedMovies) {
            try {
                userRatedMovie.setMovieAverageRating(movieRatingUpdated.getAverageRating());
                userRatedMovie.setMovieScores(movieRatingUpdated.getScores());
                userRatedMoviesRepository.save(userRatedMovie);
            } catch (OptimisticLockingFailureException ignored) {}
        }
    }

    @KafkaListener(
            topics = "movies-deleted",
            groupId = "user-library-group",
            containerFactory = "movieDeletedContainerFactory"
    )
    public void handleMovieDeleted(MovieDeleted movieDeleted) {
//        Criteria criteria = new Criteria("movieId").is(movieDeleted.getMovieId());
//        CriteriaQuery criteriaQuery = new CriteriaQuery(criteria);
//        elasticsearchOperations.delete(String.valueOf(criteriaQuery), UserRatedMovie.class);
        System.out.println("MovieDeleted: movieId=" + movieDeleted.getMovieId());
        userRatedMoviesRepository.deleteAllByMovieId(movieDeleted.getMovieId());
    }

    public PageResponse<UserRatedMovieResponse> searchUserRatedMovies(
            Long userId,
            int page,
            int limit,
            String[] sort,
            Double minRating
    ) {
        Criteria criteria = new Criteria("userId").is(userId.toString());

        if (minRating != null) {
            criteria = criteria.and(new Criteria("minRating").greaterThanEqual(minRating));
        }

        Sort sortObj = parseSort(sort);

        PageRequest pageRequest = PageRequest.of(page, limit, sortObj);

        CriteriaQuery query = new CriteriaQuery(criteria).setPageable(pageRequest);

        SearchHits<UserRatedMovie> hits = elasticsearchOperations.search(query, UserRatedMovie.class);

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

    private Sort parseSort(String[] sortParams) {
        List<Sort.Order> orders = new ArrayList<>();

        for (String param : sortParams) {
            String[] parts = param.split(":");
            String field = parts[0];
            Sort.Direction direction = parts.length > 1 && parts[1].equalsIgnoreCase("asc")
                    ? Sort.Direction.ASC
                    : Sort.Direction.DESC;
            orders.add(new Sort.Order(direction, field));
        }

        return Sort.by(orders);
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

}
