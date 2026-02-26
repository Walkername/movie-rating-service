package ru.walkername.movie_catalog.services;

import lombok.extern.slf4j.Slf4j;
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
import ru.walkername.movie_catalog.mapper.MovieMapper;
import ru.walkername.movie_catalog.models.Movie;
import ru.walkername.movie_catalog.repositories.MoviesRepository;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@Transactional(readOnly = true)
@CacheConfig(cacheNames = "movie-cache")
public class MoviesService {

    private final MoviesRepository moviesRepository;
    private final String RATING_SERVICE_URL;
    private final String FILE_SERVICE_URL;
    private final RestTemplate restTemplate;
    private final KafkaProducerService kafkaProducerService;
    private final MovieMapper movieMapper;

    private static final String MOVIE_POSTER = "movie-poster";

    @Autowired
    public MoviesService(
            MoviesRepository moviesRepository,
            @Value("${rating.service.url}") String RATING_SERVICE_URL,
            @Value("${file.service.url}") String FILE_SERVICE_URL,
            RestTemplate restTemplate,
            KafkaProducerService kafkaProducerService,
            MovieMapper movieMapper) {
        this.moviesRepository = moviesRepository;
        this.RATING_SERVICE_URL = RATING_SERVICE_URL;
        this.FILE_SERVICE_URL = FILE_SERVICE_URL;
        this.restTemplate = restTemplate;
        this.kafkaProducerService = kafkaProducerService;
        this.movieMapper = movieMapper;
    }

    @Cacheable(cacheNames = "movie", key = "#id", unless = "#result == null")
    public Movie findOne(Long id) {
        return moviesRepository.findById(id)
                .orElseThrow(() -> new MovieNotFound("Movie not found"));
    }

    @Caching(evict = {
            // delete cache findOne()
            @CacheEvict(cacheNames = "movie", key = "#ratingCreated.movieId()", condition = "#ratingCreated.movieId() != null"),
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
        Optional<Movie> movie = moviesRepository.findById(ratingCreated.movieId());
        if (movie.isEmpty()) {
            log.warn(
                    "From kafka: update avg rating (create new) attempt for non-existent movie with id={}",
                    ratingCreated.movieId()
            );
        }
        movie.ifPresent(value -> {
            int newRating = ratingCreated.rating();
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
            @CacheEvict(cacheNames = "movie", key = "#ratingUpdated.movieId()", condition = "#ratingUpdated.movieId() != null"),
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
        Optional<Movie> movie = moviesRepository.findById(ratingUpdated.movieId());
        if (movie.isEmpty()) {
            log.warn(
                    "From kafka: update avg rating (update existing) attempt for non-existent movie with id={}",
                    ratingUpdated.movieId()
            );
        }
        movie.ifPresent(value -> {
            int newRating = ratingUpdated.rating();
            int oldRating = ratingUpdated.oldRating();
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
            @CacheEvict(cacheNames = "movie", key = "#ratingDeleted.movieId()", condition = "#ratingDeleted.movieId() != null"),
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
        Optional<Movie> movie = moviesRepository.findById(ratingDeleted.movieId());
        if (movie.isEmpty()) {
            log.warn(
                    "From kafka: update avg rating (delete existing) attempt for non-existent movie with id={}",
                    ratingDeleted.movieId()
            );
        }
        movie.ifPresent(value -> {
            int ratingToDelete = ratingDeleted.rating();
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

        Map<Long, String> posterUrlMap = files.stream()
                .collect(Collectors.toMap(
                        FileAttachmentResponse::entityId,
                        FileAttachmentResponse::url,
                        (existing, _) -> existing)
                );

        List<MovieResponse> movieResponses = moviesPage.getContent().stream()
                .map(movie -> {
                    String posterUrl = posterUrlMap.get(movie.getId());
                    return movieMapper.toMovieResponse(movie, posterUrl);
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

        String endpoint = "/files/download-by-array/signed-url";

        UriComponentsBuilder builder = UriComponentsBuilder
                .fromUriString(FILE_SERVICE_URL + endpoint)
                .queryParam("entityType", "movie");

        ResponseEntity<List<FileAttachmentResponse>> response = restTemplate.exchange(
                builder.toUriString(),
                HttpMethod.POST,
                entity,
                new ParameterizedTypeReference<>() {
                }
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
        UriComponentsBuilder builder = UriComponentsBuilder.fromUriString(RATING_SERVICE_URL + "/ratings/user/" + id)
                .queryParam("page", page)
                .queryParam("limit", moviesPerPage);

        if (sort != null) {
            for (String s : sort) {
                builder.queryParam("sort", s);
            }
        }

        // Getting Rating list by user_id
        RatingsResponse ratingsResponse = restTemplate.getForObject(builder.toUriString(), RatingsResponse.class);
        if (ratingsResponse == null || ratingsResponse.pageResponse() == null) {
            return new PageResponse<>(
                    Collections.emptyList(),
                    page,
                    moviesPerPage,
                    0,
                    0
            );
        }
        PageResponse<RatingResponse> pageResponse = ratingsResponse.pageResponse();

        List<RatingResponse> ratings = pageResponse.content();

        // Building list with movieIds from Rating list
        List<Long> movieIds = new ArrayList<>();
        for (RatingResponse rating : ratings) {
            movieIds.add(rating.movieId());
        }

        // Getting Movie list by movieIds list
        List<Movie> ratedMovies = moviesRepository.findAllById(movieIds);

        // Building list with movie details: title, release year, rating from user, etc.
        List<MovieByUserResponse> movieByUserResponseList = new ArrayList<>();
        // TODO: maybe improve algorithm, because this will be very slow with big amount of data
        for (RatingResponse rating : ratings) {
            for (Movie movie : ratedMovies) {
                if (rating.movieId().equals(movie.getId())) {
                    MovieByUserResponse movieByUserResponse = new MovieByUserResponse(movie, rating);
                    movieByUserResponseList.add(movieByUserResponse);
                }
            }
        }

        return new PageResponse<>(
                movieByUserResponseList,
                page,
                moviesPerPage,
                pageResponse.totalElements(),
                pageResponse.totalPages()
        );
    }

    public List<Movie> findByTitleStartingWith(String title) {
        if (title.isEmpty()) {
            return Collections.emptyList();
        }
        return moviesRepository.findByTitleStartingWithIgnoreCase(title);
    }

    @CacheEvict(cacheNames = "movie", key = "#fileUploaded.contextId()",
            condition = "#fileUploaded.context() != null && #fileUploaded.context().equals('movie-poster')")
    @Transactional
    @KafkaListener(
            topics = "file-uploaded",
            groupId = "movie-service-group",
            containerFactory = "fileUploadedContainerFactory"
    )
    public void saveMoviePoster(FileUploaded fileUploaded) {
        if (fileUploaded.context() != null && fileUploaded.context().equals(MOVIE_POSTER)) {
            Movie movie = moviesRepository.findById(fileUploaded.contextId()).orElseThrow(
                    () -> {
                        log.warn(
                                "From kafka: update movie poster-pic-id attempt for non-existent movie with id = {}",
                                fileUploaded.contextId()
                        );
                        return new MovieNotFound("Movie not found");
                    }
            );
            movie.setPosterPicId(fileUploaded.fileId());
        } else if (fileUploaded.context() == null) {
            log.error("Kafka event FileUploaded context is null");
        }
    }

}
