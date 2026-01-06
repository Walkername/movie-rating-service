package ru.walkername.movie_catalog.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.CacheConfig;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;
import ru.walkername.movie_catalog.dto.*;
import ru.walkername.movie_catalog.events.*;
import ru.walkername.movie_catalog.exceptions.MovieNotFound;
import ru.walkername.movie_catalog.models.Movie;
import ru.walkername.movie_catalog.repositories.MoviesRepository;
import ru.walkername.movie_catalog.util.MovieModelMapper;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
@CacheConfig(cacheNames = "movie-cache")
public class MoviesService {

    private final MoviesRepository moviesRepository;
    private final String RATING_SERVICE_API;
    private final RestTemplate restTemplate;
    private final MovieModelMapper movieModelMapper;
    private final KafkaProducerService kafkaProducerService;

    @Autowired
    public MoviesService(
            MoviesRepository moviesRepository,
            @Value("${rating.service.url}") String RATING_SERVICE_API,
            RestTemplate restTemplate, MovieModelMapper movieModelMapper,
            KafkaProducerService kafkaProducerService
    ) {
        this.moviesRepository = moviesRepository;
        this.RATING_SERVICE_API = RATING_SERVICE_API;
        this.restTemplate = restTemplate;
        this.movieModelMapper = movieModelMapper;
        this.kafkaProducerService = kafkaProducerService;
    }

    @Cacheable(cacheNames = "movie", key = "#id", unless = "#result == null")
    public Movie findOne(Long id) {
        return moviesRepository.findById(id)
                .orElseThrow(() -> new MovieNotFound("Movie not found"));
    }

    @Caching(evict = {
            // delete cache findOne()
            @CacheEvict(cacheNames = "movie", key = "#ratingCreated.getMovieId()", condition = "#ratingCreated.getMovieId() != null"),
            // delete cache getMoviesByUser()
            @CacheEvict(cacheNames = "movies-by-user", allEntries = true),
            // delete cache getMoviesWithPagination()
            @CacheEvict(cacheNames = "movies-with-pagination", allEntries = true)
    })
    @Transactional
    @KafkaListener(
            topics = "ratings-created",
            groupId = "movie-service-group",
            containerFactory = "ratingCreatedContainerFactory"
    )
    public void handleRatingCreated(RatingCreated ratingCreated) {
        Optional<Movie> movie = moviesRepository.findById(ratingCreated.getMovieId());
        movie.ifPresent(value -> {
            int newRating = ratingCreated.getRating();
            int scores = value.getScores(); // current scores
            double averageRating = value.getAverageRating(); // current average rating

            double newAverageRating = (averageRating * scores + newRating) / (scores + 1);

            value.setScores(scores + 1);
            value.setAverageRating(newAverageRating);

            // Publish Kafka event to UserLibrary
            registerMovieRatingUpdatedEvent(value);
        });
    }

    @Caching(evict = {
            // delete cache findOne()
            @CacheEvict(cacheNames = "movie", key = "#ratingUpdated.getMovieId()", condition = "#ratingUpdated.getMovieId() != null"),
            // delete cache getMoviesByUser()
            @CacheEvict(cacheNames = "movies-by-user", allEntries = true),
            // delete cache getMoviesWithPagination()
            @CacheEvict(cacheNames = "movies-with-pagination", allEntries = true)
    })
    @Transactional
    @KafkaListener(
            topics = "ratings-updated",
            groupId = "movie-service-group",
            containerFactory = "ratingUpdatedContainerFactory"
    )
    public void handleRatingUpdated(RatingUpdated ratingUpdated) {
        Optional<Movie> movie = moviesRepository.findById(ratingUpdated.getMovieId());
        movie.ifPresent(value -> {
            int newRating = ratingUpdated.getRating();
            int oldRating = ratingUpdated.getOldRating();
            int scores = value.getScores(); // current scores
            double averageRating = value.getAverageRating(); // current average rating

            double newAverageRating = (averageRating * scores - oldRating + newRating) / scores;

            value.setAverageRating(newAverageRating);

            // Publish Kafka event to UserLibrary
            registerMovieRatingUpdatedEvent(value);
        });
    }

    @Caching(evict = {
            // delete cache findOne()
            @CacheEvict(cacheNames = "movie", key = "#ratingDeleted.getMovieId()", condition = "#ratingDeleted.getMovieId() != null"),
            // delete cache getMoviesByUser()
            @CacheEvict(cacheNames = "movies-by-user", allEntries = true),
            // delete cache getMoviesWithPagination()
            @CacheEvict(cacheNames = "movies-with-pagination", allEntries = true)
    })
    @Transactional
    @KafkaListener(
            topics = "ratings-deleted",
            groupId = "movie-service-group",
            containerFactory = "ratingDeletedContainerFactory"
    )
    public void handleRatingDeleted(RatingDeleted ratingDeleted) {
        Optional<Movie> movie = moviesRepository.findById(ratingDeleted.getMovieId());
        movie.ifPresent(value -> {
            int ratingToDelete = ratingDeleted.getRating();
            int scores = value.getScores();
            double averageRating = value.getAverageRating();

            int newScores = scores - 1;
            if (newScores <= 0) {
                value.setScores(0);
                value.setAverageRating(0);
            } else {
                double newAverageRating = (averageRating * scores - ratingToDelete) / (scores - 1);
                value.setScores(scores - 1);
                value.setAverageRating(newAverageRating);
            }

            // Publish Kafka event to UserLibrary
            registerMovieRatingUpdatedEvent(value);
        });
    }

    private void registerMovieRatingUpdatedEvent(Movie movie) {
        MovieRatingUpdated movieRatingUpdated = new MovieRatingUpdated(
                movie.getId(),
                movie.getAverageRating(),
                movie.getScores()
        );

        TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
            @Override
            public void afterCommit() {
                kafkaProducerService.publishMovieRatingUpdated(movieRatingUpdated);
            }
        });
    }

    /**
     * Method to get all movies from DB with pagination
     * Method is need to do lists of movies on the site
     *
     * @param page          number of page
     * @param moviesPerPage number of movies that will be in the list
     *                      (all movies are split by this number, you give only part by page number)
     * @param sort          defines what field will be used in order to sort movies list
     * @return list of movies
     */
    @Cacheable(cacheNames = "movies-with-pagination", key = "#page + '-' + #moviesPerPage + '-' " +
            "+ (#sort != null ? T(String).join(',', #sort) : 'default')")
    public PageResponse<MovieResponse> getAllMoviesWithPagination(int page, int moviesPerPage, String[] sort) {
        Sort sorting = Sort.by(createOrders(sort));
        Pageable pageable = PageRequest.of(page, moviesPerPage, sorting);

        Page<Movie> moviesPage = moviesRepository.findAll(pageable);

        List<Long> movieIds = moviesPage.getContent().stream().map(Movie::getId).toList();

        List<FileAttachmentResponse> files = getAllPosterUrls(movieIds);

        List<MovieResponse> movieResponses = new ArrayList<>();

        for (Movie movie : moviesPage.getContent()) {
            MovieResponse movieResponse = movieModelMapper.convertToMovieResponse(movie);
            movieResponses.add(movieResponse);
        }

        Map<Long, String> posterUrlMap = files.stream()
                .collect(Collectors.toMap(
                        FileAttachmentResponse::getEntityId,
                        FileAttachmentResponse::getUrl,
                        (existing, _) -> existing)
                );

        movieResponses = movieResponses.stream()
                .peek(movie -> {
                    String posterUrl = posterUrlMap.get(movie.getId());
                    if (posterUrl != null) {
                        movie.setPosterPicUrl(posterUrl);
                    }
                }).toList();

        return new PageResponse<>(
                movieResponses,
                page,
                moviesPerPage,
                moviesPage.getTotalElements(),
                moviesPage.getTotalPages()
        );
    }

    private List<FileAttachmentResponse> getAllPosterUrls(List<Long> movieIds) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<List<Long>> entity = new HttpEntity<>(new ArrayList<>(movieIds), headers);

        String url = "http://localhost:8083/files/download-by-array/signed-url?entityType=movie";

        ResponseEntity<List<FileAttachmentResponse>> response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                entity,
                new ParameterizedTypeReference<>() {}
        );

        if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
            return response.getBody();
        } else {
            return Collections.emptyList();
        }
    }

    private List<Sort.Order> createOrders(String[] sort) {
        return Arrays.stream(sort).map(this::parseSort).toList();
    }

    private Sort.Order parseSort(String sortParam) {
        String[] parts = sortParam.split(":");
        String property = parts[0];
        Sort.Direction direction = parts.length > 1 ? Sort.Direction.fromString(parts[1]) : Sort.Direction.DESC;
        return new Sort.Order(direction, property);
    }

    /**
     * Method to get movies from DB, which was rated by specific user
     *
     * @param id indicates the user ID whose rated movies you want to get
     * @return list of movies with details of rating
     */
    @Cacheable(cacheNames = "movies-by-user", key = "#id + '-' + #page + '-' + #moviesPerPage + '-' " +
            "+ (#sort != null ? T(String).join(',', #sort) : 'default')")
    public PageResponse<MovieByUserResponse> getMoviesByUser(Long id, int page, int moviesPerPage, String[] sort) {
        UriComponentsBuilder builder = UriComponentsBuilder.fromUriString(RATING_SERVICE_API + "/ratings/user/" + id)
                .queryParam("page", page)
                .queryParam("limit", moviesPerPage);

        if (sort != null) {
            for (String s : sort) {
                builder.queryParam("sort", s);
            }
        }

        // Getting Rating list by user_id
        RatingsResponse ratingsResponse = restTemplate.getForObject(builder.toUriString(), RatingsResponse.class);
        if (ratingsResponse == null || ratingsResponse.getPageResponse() == null) {
            return new PageResponse<>(
                    Collections.emptyList(),
                    page,
                    moviesPerPage,
                    0,
                    0
            );
        }
        PageResponse<RatingResponse> pageResponse = ratingsResponse.getPageResponse();

        List<RatingResponse> ratings = pageResponse.getContent();

        // Building list with movieIds from Rating list
        List<Long> movieIds = new ArrayList<>();
        for (RatingResponse rating : ratings) {
            movieIds.add(rating.getMovieId());
        }

        // Getting Movie list by movieIds list
        List<Movie> ratedMovies = moviesRepository.findAllById(movieIds);

        // Building list with movie details: title, release year, rating from user, etc.
        List<MovieByUserResponse> movieByUserResponseList = new ArrayList<>();
        // TODO: maybe improve algorithm, because this will be very slow with big amount of data
        for (RatingResponse rating : ratings) {
            for (Movie movie : ratedMovies) {
                if (rating.getMovieId().equals(movie.getId())) {
                    MovieByUserResponse movieByUserResponse = new MovieByUserResponse(movie, rating);
                    movieByUserResponseList.add(movieByUserResponse);
                }
            }
        }

        return new PageResponse<>(
                movieByUserResponseList,
                page,
                moviesPerPage,
                pageResponse.getTotalElements(),
                pageResponse.getTotalPages()
        );
    }

    public List<Movie> findByTitleStartingWith(String title) {
        if (title.isEmpty()) {
            return Collections.emptyList();
        }
        return moviesRepository.findByTitleStartingWithIgnoreCase(title);
    }

    @CacheEvict(cacheNames = "movie", key = "#fileUploaded.getContextId()",
            condition = "#fileUploaded.getContext() != null && #fileUploaded.getContext().equals('movie-poster')")
    @Transactional
    @KafkaListener(
            topics = "file-uploaded",
            groupId = "movie-service-group",
            containerFactory = "fileUploadedContainerFactory"
    )
    public void saveMoviePoster(FileUploaded fileUploaded) {
        if (fileUploaded.getContext() != null && fileUploaded.getContext().equals("movie-poster")) {
            Movie movie = moviesRepository.findById(fileUploaded.getContextId()).orElseThrow(
                    () -> new MovieNotFound("Movie not found")
            );
            movie.setPosterPicId(fileUploaded.getFileId());
        }
    }

}
