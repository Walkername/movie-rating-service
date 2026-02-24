package ru.walkername.movie_catalog.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.walkername.movie_catalog.dto.MovieByUserResponse;
import ru.walkername.movie_catalog.dto.MovieResponse;
import ru.walkername.movie_catalog.dto.PageResponse;
import ru.walkername.movie_catalog.mapper.MovieMapper;
import ru.walkername.movie_catalog.models.Movie;
import ru.walkername.movie_catalog.services.MoviesService;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/movies")
public class MoviesController {

    private final MoviesService moviesService;
    private final MovieMapper movieMapper;

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
        Movie movie = moviesService.findOne(id);

        MovieResponse movieResponse = movieMapper.toMovieResponse(movie);

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
    public ResponseEntity<List<MovieResponse>> search(
        @RequestParam(value = "query") String query
    ) {
        List<Movie> movies = moviesService.findByTitleStartingWith(query);

        List<MovieResponse> movieResponses = movies.stream().map(movieMapper::toMovieResponse).toList();

        return new ResponseEntity<>(movieResponses, HttpStatus.OK);
    }

}
