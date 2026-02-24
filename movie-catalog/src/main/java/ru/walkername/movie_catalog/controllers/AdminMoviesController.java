package ru.walkername.movie_catalog.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.walkername.movie_catalog.dto.MovieRequest;
import ru.walkername.movie_catalog.mapper.MovieMapper;
import ru.walkername.movie_catalog.models.Movie;
import ru.walkername.movie_catalog.services.AdminMoviesService;

@RequiredArgsConstructor
@RestController
@RequestMapping("/admin/movies")
public class AdminMoviesController {

    private final AdminMoviesService adminMoviesService;
    private final MovieMapper movieMapper;

    @PostMapping("")
    public ResponseEntity<HttpStatus> add(
            @RequestBody @Valid MovieRequest movieRequest
    ) {
        Movie movie = movieMapper.toMovie(movieRequest);

        adminMoviesService.save(movie);

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PatchMapping("/{id}")
    public ResponseEntity<HttpStatus> update(
            @PathVariable("id") Long id,
            @RequestBody @Valid MovieRequest movieRequest
    ) {
        Movie movie = movieMapper.toMovie(movieRequest);

        adminMoviesService.update(id, movie);

        return ResponseEntity.ok().build();
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

        return ResponseEntity.noContent().build();
    }

}
