package ru.walkername.movie_catalog.services;

import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Caching;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;
import ru.walkername.movie_catalog.events.MovieDeleted;
import ru.walkername.movie_catalog.events.MovieUpdated;
import ru.walkername.movie_catalog.exceptions.MovieNotFound;
import ru.walkername.movie_catalog.mapper.MovieMapper;
import ru.walkername.movie_catalog.models.Movie;
import ru.walkername.movie_catalog.repositories.MoviesRepository;

import java.time.Instant;

@RequiredArgsConstructor
@Service
public class AdminMoviesService {

    private final MoviesRepository moviesRepository;
    private final KafkaProducerService kafkaProducerService;
    private final MovieMapper movieMapper;

    @Caching(evict = {
            @CacheEvict(cacheNames = "movies-with-pagination", allEntries = true)
    })
    @Transactional
    public void save(Movie movie) {
        movie.setCreatedAt(Instant.now());

        moviesRepository.save(movie);
    }

    @CacheEvict(cacheNames = "movie", key = "#id")
    @Transactional
    public void update(Long id, Movie updatedMovie) {
        Movie movie = moviesRepository.findById(id).orElseThrow(
                () -> new MovieNotFound("Movie not found")
        );

        movieMapper.toMovie(updatedMovie, movie);

        moviesRepository.save(movie);

        registerMovieUpdatedEvent(movie);
    }

    private void registerMovieUpdatedEvent(Movie movie) {
        MovieUpdated movieUpdated = new MovieUpdated(
                movie.getId(),
                movie.getTitle(),
                movie.getReleaseYear()
        );

        TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
            @Override
            public void afterCommit() {
                kafkaProducerService.publishMovieUpdated(movieUpdated);
            }
        });
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
