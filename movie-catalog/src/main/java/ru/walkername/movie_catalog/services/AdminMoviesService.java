package ru.walkername.movie_catalog.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Caching;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;
import ru.walkername.movie_catalog.events.MovieDeleted;
import ru.walkername.movie_catalog.exceptions.MovieNotFound;
import ru.walkername.movie_catalog.models.Movie;
import ru.walkername.movie_catalog.repositories.MoviesRepository;

import java.util.Date;

@Service
public class AdminMoviesService {

    private final MoviesRepository moviesRepository;
    private final KafkaProducerService kafkaProducerService;

    @Autowired
    public AdminMoviesService(MoviesRepository moviesRepository, KafkaProducerService kafkaProducerService) {
        this.moviesRepository = moviesRepository;
        this.kafkaProducerService = kafkaProducerService;
    }

    @Caching(evict = {
            // delete cache getMoviesWithPagination()
            @CacheEvict(cacheNames = "movies-with-pagination", allEntries = true)
    })
    @Transactional
    public void save(Movie movie) {
        movie.setCreatedAt(new Date());
        moviesRepository.save(movie);
    }

    @CacheEvict(cacheNames = "movie", key = "#id")
    @Transactional
    public void update(Long id, Movie updatedMovie) {
        updatedMovie.setId(id);
        moviesRepository.save(updatedMovie);
    }

    @CacheEvict(cacheNames = "movie", key = "#movieId")
    @Transactional
    public void updatePosterPicture(Long movieId, Long fileId) {
        Movie movie = moviesRepository.findById(movieId).orElseThrow(
                () -> new MovieNotFound("Movie not found")
        );
        movie.setPosterPicId(fileId);
    }

    @Caching(evict = {
            @CacheEvict(cacheNames = "movie", key = "#id"),
            @CacheEvict(cacheNames = "movies-with-pagination", allEntries = true),
            @CacheEvict(cacheNames = "movies-by-user", allEntries = true)
    })
    @Transactional
    public void delete(Long id) {
        moviesRepository.deleteById(id);

        // Kafka: send to Rating Service in order
        // to delete all ratings with this movieId
        registerMovieDeletedEvent(id);
    }

    private void registerMovieDeletedEvent(Long movieId) {
        MovieDeleted movieDeleted = new MovieDeleted(movieId);

        TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
            @Override
            public void afterCommit() {
                kafkaProducerService.publishMovieDeleted(movieDeleted);
            }
        });
    }

}
