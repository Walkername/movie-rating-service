package ru.walkername.movie_catalog.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Caching;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.walkername.movie_catalog.models.Movie;
import ru.walkername.movie_catalog.repositories.MoviesRepository;

import java.util.Date;

@Service
public class AdminMoviesService {

    private final MoviesRepository moviesRepository;

    @Autowired
    public AdminMoviesService(MoviesRepository moviesRepository) {
        this.moviesRepository = moviesRepository;
    }

    @Caching(evict = {
            // delete cache getMoviesNumber()
            @CacheEvict(cacheNames = "movies-number", allEntries = true),
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

    @Caching(evict = {
            @CacheEvict(cacheNames = "movie", key = "#id"),
            @CacheEvict(cacheNames = "movies-number", allEntries = true),
            @CacheEvict(cacheNames = "movies-with-pagination", allEntries = true)
    })
    @Transactional
    public void delete(Long id) {
        moviesRepository.deleteById(id);
    }

}
