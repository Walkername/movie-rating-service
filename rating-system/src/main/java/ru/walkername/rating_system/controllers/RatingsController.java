package ru.walkername.rating_system.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import ru.walkername.rating_system.dto.*;
import ru.walkername.rating_system.mapper.RatingMapper;
import ru.walkername.rating_system.models.Rating;
import ru.walkername.rating_system.security.UserPrincipal;
import ru.walkername.rating_system.services.RatingsService;

@RequiredArgsConstructor
@RestController
@RequestMapping("/ratings")
@CrossOrigin
public class RatingsController {

    private final RatingsService ratingsService;
    private final RatingMapper ratingMapper;

    @PostMapping("/rate")
    public ResponseEntity<HttpStatus> rate(
            @RequestBody @Valid RatingRequest ratingRequest,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        Rating rating = ratingMapper.toRating(ratingRequest);
        rating.setUserId(userPrincipal.userId());

        ratingsService.save(rating);

        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{movieId}")
    public ResponseEntity<HttpStatus> delete(
            @PathVariable("movieId") Long movieId,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        Long userId = userPrincipal.userId();

        ratingsService.delete(movieId, userId);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{userId}/{movieId}")
    public ResponseEntity<RatingResponse> getRating(
            @PathVariable("userId") Long userId,
            @PathVariable("movieId") Long movieId
    ) {
        Rating rating = ratingsService.findOne(userId, movieId);

        RatingResponse ratingResponse;
        if (rating == null) {
            ratingResponse = new RatingResponse(userId, movieId, null, null);
        } else {
            ratingResponse = ratingMapper.toRatingResponse(rating);
        }

        return new ResponseEntity<>(ratingResponse, HttpStatus.OK);
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<RatingsResponse> getRatingsByUser(
            @PathVariable("id") Long id,
            @RequestParam(value = "page", defaultValue = "0") Integer page,
            @RequestParam(value = "limit", defaultValue = "10") Integer limit,
            @RequestParam(value = "sort", defaultValue = "ratedAt:desc") String[] sort
    ) {
        RatingsResponse ratingsResponse = ratingsService.getRatingsByUser(id, page, limit, sort);
        return new ResponseEntity<>(ratingsResponse, HttpStatus.OK);
    }

}
