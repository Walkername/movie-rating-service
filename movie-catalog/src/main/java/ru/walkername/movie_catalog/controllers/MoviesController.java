package ru.walkername.movie_catalog.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.walkername.movie_catalog.dto.MovieByUserResponse;
import ru.walkername.movie_catalog.dto.MovieResponse;
import ru.walkername.movie_catalog.dto.PageResponse;
import ru.walkername.movie_catalog.models.Movie;
import ru.walkername.movie_catalog.services.MoviesService;
import ru.walkername.movie_catalog.util.MovieModelMapper;

import java.util.List;

@RestController
@RequestMapping("/movies")
@CrossOrigin
public class MoviesController {

    private final MoviesService moviesService;
    private final MovieModelMapper movieModelMapper;

    @Autowired
    public MoviesController(MoviesService moviesService, MovieModelMapper movieModelMapper) {
        this.moviesService = moviesService;
        this.movieModelMapper = movieModelMapper;
    }

    @GetMapping()
    public ResponseEntity<PageResponse<MovieResponse>> index(
            @RequestParam(value = "page", defaultValue = "0") Integer page,
            @RequestParam(value = "limit", defaultValue = "10") Integer limit,
            @RequestParam(value = "sort", defaultValue = "averageRating:desc") String[] sort
    ) {
        PageResponse<MovieResponse> pageResponse = moviesService.getAllMoviesWithPagination(page, limit, sort);
        return new ResponseEntity<>(pageResponse, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MovieResponse> getMovie(
            @PathVariable("id") Long id
    ) {
        MovieResponse movieResponse = movieModelMapper.convertToMovieResponse(moviesService.findOne(id));
        return new ResponseEntity<>(movieResponse, HttpStatus.OK);
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<PageResponse<MovieByUserResponse>> getMoviesByUserId(
            @PathVariable("id") Long id,
            @RequestParam(value = "page", defaultValue = "0") Integer page,
            @RequestParam(value = "limit", defaultValue = "10") Integer limit,
            @RequestParam(value = "sort", defaultValue = "ratedAt:desc") String[] sort
    ) {
        PageResponse<MovieByUserResponse> pageResponse = moviesService.getMoviesByUser(id, page, limit, sort);
        return new ResponseEntity<>(pageResponse, HttpStatus.OK);
    }

    @GetMapping("/search")
    public List<Movie> search(
        @RequestParam(value = "query") String query
    ) {
        return moviesService.findByTitleStartingWith(query);
    }

}
