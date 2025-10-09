package ru.walkername.movie_catalog.controllers;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import ru.walkername.movie_catalog.dto.MovieRequest;
import ru.walkername.movie_catalog.models.Movie;
import ru.walkername.movie_catalog.services.AdminMoviesService;
import ru.walkername.movie_catalog.services.MoviesService;
import ru.walkername.movie_catalog.util.DTOValidator;
import ru.walkername.movie_catalog.util.MovieModelMapper;
import ru.walkername.movie_catalog.util.MovieWrongValidationException;

@RestController
@RequestMapping("/admin/movies")
@CrossOrigin
public class AdminMoviesController {

    private final AdminMoviesService adminMoviesService;
    private final MoviesService moviesService;
    private final MovieModelMapper movieModelMapper;

    @Autowired
    public AdminMoviesController(AdminMoviesService adminMoviesService, MoviesService moviesService, MovieModelMapper movieModelMapper) {
        this.adminMoviesService = adminMoviesService;
        this.moviesService = moviesService;
        this.movieModelMapper = movieModelMapper;
    }

    @PostMapping("")
    public ResponseEntity<HttpStatus> add(
            @RequestBody @Valid MovieRequest movieRequest,
            BindingResult bindingResult
    ) {
        DTOValidator.validate(bindingResult, MovieWrongValidationException::new);
        Movie movie = movieModelMapper.convertToMovie(movieRequest);
        adminMoviesService.save(movie);
        return ResponseEntity.ok(HttpStatus.OK);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<HttpStatus> update(
            @PathVariable("id") Long id,
            @RequestBody @Valid MovieRequest movieRequest,
            BindingResult bindingResult
    ) {
        DTOValidator.validate(bindingResult, MovieWrongValidationException::new);
        Movie movie = moviesService.findOne(id);
        if (movie != null) {
            movieModelMapper.convertToMovie(movieRequest, movie);
            adminMoviesService.update(id, movie);
        }
        return ResponseEntity.ok(HttpStatus.OK);
    }

    @PatchMapping("/{id}/poster-pic")
    public ResponseEntity<HttpStatus> updatePosterPic(
            @PathVariable("id") Long id,
            @RequestParam("fileId") Long fileId
    ) {
        adminMoviesService.updatePosterPicture(id, fileId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> delete(
            @PathVariable("id") Long id
    ) {
        adminMoviesService.delete(id);
        return ResponseEntity.ok().build();
    }

}
