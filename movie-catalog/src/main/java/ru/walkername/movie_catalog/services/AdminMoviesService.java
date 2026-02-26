package ru.walkername.movie_catalog.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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

@Slf4j
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

        log.info("Movie added successfully: id={}, title={}", movie.getId(), movie.getTitle());
    }

    @CacheEvict(cacheNames = "movie", key = "#id")
    @Transactional
    public void update(Long id, Movie updatedMovie) {
        Movie movie = moviesRepository.findById(id).orElseThrow(
                () -> {
                    log.warn("Update attempt for non-existent movie with id={}", id);
                    return new MovieNotFound("Movie not found");
                }
        );

        movieMapper.toMovie(updatedMovie, movie);

        moviesRepository.save(movie);

        registerMovieUpdatedEvent(movie);

        log.info("Movie updated successfully: id={}, title={}", id, movie.getTitle());
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
                () -> {
                    log.warn("Update poster attempt for non-existent movie with id={}", movieId);
                    return new MovieNotFound("Movie not found");
                }
        );
        movie.setPosterPicId(fileId);

        log.info("Movie poster updated successfully: id={}, title={}", movieId, movie.getTitle());
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

        log.info("Movie deleted successfully: id={}", id);
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
