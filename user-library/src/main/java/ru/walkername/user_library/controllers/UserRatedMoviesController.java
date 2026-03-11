package ru.walkername.user_library.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.walkername.user_library.dto.PageResponse;
import ru.walkername.user_library.dto.UserRatedMovieResponse;
import ru.walkername.user_library.services.UserRatedMoviesService;

@RequiredArgsConstructor
@RestController
@RequestMapping("/user-movies")
public class UserRatedMoviesController {

    private final UserRatedMoviesService userRatedMoviesService;

    @GetMapping("/{userId}")
    public ResponseEntity<PageResponse<UserRatedMovieResponse>> getUserRatedMovies(
            @PathVariable("userId") Long userId,
            @RequestParam(value = "page", defaultValue = "0") Integer page,
            @RequestParam(value = "limit", defaultValue = "10") Integer limit,
            @RequestParam(value = "sort", defaultValue = "ratedAt:desc") String sort,
            @RequestParam(value = "minRating", required = false) Double minRating
    ) {
        PageResponse<UserRatedMovieResponse> pageResponse =
                userRatedMoviesService.getUserRatedMovies(userId, page, limit, sort, minRating);
        return new ResponseEntity<>(pageResponse, HttpStatus.OK);
    }

    @GetMapping("/{userId}/search")
    public ResponseEntity<PageResponse<UserRatedMovieResponse>> searchUserRatedMovies(
            @PathVariable("userId") Long userId,
            @RequestParam("query") String query
    ) {
        PageResponse<UserRatedMovieResponse> pageResponse =
                userRatedMoviesService.searchUserRatedMoviesByTitle(userId, query);
        return new ResponseEntity<>(pageResponse, HttpStatus.OK);
    }

}
