package ru.walkername.movie_catalog.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.CacheConfig;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;
import ru.walkername.movie_catalog.dto.MovieDetails;
import ru.walkername.movie_catalog.dto.NewRatingDTO;
import ru.walkername.movie_catalog.dto.RatingsResponse;
import ru.walkername.movie_catalog.models.Movie;
import ru.walkername.movie_catalog.models.Rating;
import ru.walkername.movie_catalog.repositories.MoviesRepository;

import java.util.*;

@Service
@Transactional(readOnly = true)
@CacheConfig(cacheNames = "movie-cache")
public class MoviesService {

    private final MoviesRepository moviesRepository;

    private final String RATING_SERVICE_API;

    private final RestTemplate restTemplate;

    @Autowired
    public MoviesService(
            MoviesRepository moviesRepository,
            @Value("${rating.service.url}") String RATING_SERVICE_API,
            RestTemplate restTemplate) {
        this.moviesRepository = moviesRepository;
        this.RATING_SERVICE_API = RATING_SERVICE_API;
        this.restTemplate = restTemplate;
    }

    @CacheEvict(cacheNames = "movies-number", allEntries = true)
    @Transactional
    public void save(Movie movie) {
        moviesRepository.save(movie);
    }

    @Cacheable(cacheNames = "movie", key = "#id", unless = "#result == null")
    public Movie findOne(int id) {
        Optional<Movie> movie = moviesRepository.findById(id);
        return movie.orElse(null);
    }

    @CacheEvict(cacheNames = "movie", key = "#id")
    @Transactional
    public void update(int id, Movie updatedMovie) {
        updatedMovie.setId(id);
        moviesRepository.save(updatedMovie);
    }

    @Caching(evict = {
            @CacheEvict(cacheNames = "movie", key = "#id"),
            @CacheEvict(cacheNames = "movies-number", allEntries = true),
    })
    @Transactional
    public void delete(int id) {
        moviesRepository.deleteById(id);
    }

    @Caching(evict = {
            // delete cache findOne()
            @CacheEvict(cacheNames = "movie", key = "#ratingDTO.getMovieId()", condition = "#ratingDTO.getMovieId() != null"),
            // delete cache getMoviesByUser()
            @CacheEvict(cacheNames = "movies-by-user", allEntries = true),
            // delete cache getMoviesWithPagination()
            @CacheEvict(cacheNames = "movies-with-pagination", allEntries = true)
    })
    @Transactional
    @KafkaListener(
            topics = "ratings-topic",
            groupId = "movie-service-group",
            containerFactory = "kafkaListenerContainerFactory"
    )
    public void updateAverageRating(NewRatingDTO ratingDTO) {
        Optional<Movie> movie = moviesRepository.findById(ratingDTO.getMovieId());
        movie.ifPresent(value -> {
            double newRating = ratingDTO.getRating();
            double oldRating = ratingDTO.getOldRating();
            boolean isUpdate = ratingDTO.isUpdate();

            int scores = value.getScores();
            double averageRating = value.getAverageRating();
            double newAverageRating;

            if (!isUpdate) {
                newAverageRating = (averageRating * scores + newRating) / (scores + 1);
                value.setScores(scores + 1);
            } else {
                newAverageRating = (averageRating * scores - oldRating + newRating) / scores;
            }

            value.setAverageRating(newAverageRating);
        });
    }

    @Cacheable(cacheNames = "movies-number")
    public long getMoviesNumber() {
        return moviesRepository.count();
    }

    /**
     * Method to get all movies from DB
     * @return list of movies
     */
    public List<Movie> getAllMovies() {
        return moviesRepository.findAll();
    }

    /**
     * Method to get all movies from DB with pagination
     * Method is need to do lists of movies on the site
     * @param page number of page
     * @param moviesPerPage number of movies that will be in the list
     *                      (all movies are split by this number, you give only part by page number)
     * @param sort defines what field will be used in order to sort movies list
     * @return list of movies
     */
    @Cacheable(cacheNames = "movies-with-pagination", key = "#page + '-' + #moviesPerPage + '-' " +
            "+ (#sort != null ? T(String).join(',', #sort) : 'default')")
    public List<Movie> getAllMoviesWithPagination(int page, int moviesPerPage, String[] sort) {
        Sort sorting = Sort.by(createOrders(sort));
        Pageable pageable = PageRequest.of(page, moviesPerPage, sorting);
        return moviesRepository.findAll(pageable).getContent();
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
    public List<MovieDetails> getMoviesByUser(int id, int page, int moviesPerPage, String[] sort) {
        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(RATING_SERVICE_API + "/ratings/user/" + id)
                .queryParam("page", page)
                .queryParam("limit", moviesPerPage);

        if (sort != null) {
            for (String s : sort) {
                builder.queryParam("sort", s);
            }
        }

        // Getting Rating list by user_id
        RatingsResponse ratingsResponse = restTemplate.getForObject(builder.toUriString(), RatingsResponse.class);
        if (ratingsResponse == null) {
            return new ArrayList<>();
        }
        List<Rating> ratings = ratingsResponse.getRatings();

        // Building list with movieIds from Rating list
        List<Integer> movieIds = new ArrayList<>();
        for (Rating rating : ratings) {
            movieIds.add(rating.getMovieId());
        }

        // Getting Movie list by movieIds list
        List<Movie> ratedMovies = moviesRepository.findAllById(movieIds);

        // Building list with movie details: title, release year, rating from user, etc.
        List<MovieDetails> movieDetailsList = new ArrayList<>();
        // TODO: maybe improve algorithm, because this will be very slow with big amount of data
        for (Rating rating : ratings) {
            for (Movie movie : ratedMovies) {
                if (rating.getMovieId() == movie.getId()) {
                    MovieDetails movieDetails = new MovieDetails(movie, rating);
                    movieDetailsList.add(movieDetails);
                }
            }
        }

        return movieDetailsList;
    }

    public List<Movie> findByTitleStartingWith(String title) {
        if (title.isEmpty()) {
            return Collections.emptyList();
        }
        return moviesRepository.findByTitleStartingWith(title);
    }

}
