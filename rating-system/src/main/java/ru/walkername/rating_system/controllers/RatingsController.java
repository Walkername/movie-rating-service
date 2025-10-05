package ru.walkername.rating_system.controllers;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import ru.walkername.rating_system.dto.*;
import ru.walkername.rating_system.models.Rating;
import ru.walkername.rating_system.security.UserPrincipal;
import ru.walkername.rating_system.services.RatingsService;
import ru.walkername.rating_system.exceptions.RatingWrongValidationException;
import ru.walkername.rating_system.utils.DTOValidator;
import ru.walkername.rating_system.utils.RatingModelMapper;
import ru.walkername.rating_system.utils.RatingValidator;

@RestController
@RequestMapping("/ratings")
@CrossOrigin
public class RatingsController {

    private final RatingsService ratingsService;
    private final RatingValidator ratingValidator;
    private final RatingModelMapper ratingModelMapper;

    @Autowired
    public RatingsController(RatingsService ratingsService, RatingValidator ratingValidator, RatingModelMapper ratingModelMapper) {
        this.ratingsService = ratingsService;
        this.ratingValidator = ratingValidator;
        this.ratingModelMapper = ratingModelMapper;
    }

    @PostMapping("/add")
    public ResponseEntity<HttpStatus> add(
            @RequestBody @Valid RatingRequest ratingRequest,
            BindingResult bindingResult,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        Rating rating = ratingModelMapper.convertToRating(ratingRequest);
        rating.setUserId(userPrincipal.getUserId());

        ratingValidator.validate(rating, bindingResult);
        DTOValidator.validate(bindingResult, RatingWrongValidationException::new);
        ratingsService.save(rating);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/edit/{id}")
    public ResponseEntity<HttpStatus> update(
            @PathVariable("id") Long id,
            @RequestBody @Valid RatingRequest ratingRequest,
            BindingResult bindingResult,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        DTOValidator.validate(bindingResult, RatingWrongValidationException::new);
        Rating rating = ratingModelMapper.convertToRating(ratingRequest);
        rating.setUserId(userPrincipal.getUserId());

        ratingsService.update(id, rating);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<HttpStatus> delete(
            @PathVariable("id") Long id
    ) {
        ratingsService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{userId}/{movieId}")
    public ResponseEntity<RatingResponse> getRating(
            @PathVariable("userId") Long userId,
            @PathVariable("movieId") Long movieId
    ) {
        RatingResponse ratingResponse = ratingModelMapper.convertToRatingResponse(ratingsService.findOne(userId, movieId));
        return new ResponseEntity<>(ratingResponse, HttpStatus.OK);
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<PageResponse<RatingResponse>> getRatingsByUser(
            @PathVariable("id") Long id,
            @RequestParam(value = "page", defaultValue = "0") Integer page,
            @RequestParam(value = "limit", defaultValue = "10") Integer limit,
            @RequestParam(value = "sort", defaultValue = "ratedAt:desc") String[] sort
    ) {
        PageResponse<RatingResponse> pageResponse = ratingsService.getRatingsByUser(id, page, limit, sort);
        return new ResponseEntity<>(pageResponse, HttpStatus.OK);
    }

//    @GetMapping("/movie/{id}")
//    public RatingsResponse getRatingsByMovie(
//            @PathVariable("id") Long id
//    ) {
//        return new RatingsResponse(ratingsService.getRatingsByMovie(id));
//    }

}
