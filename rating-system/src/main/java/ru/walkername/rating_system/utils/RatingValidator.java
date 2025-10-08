package ru.walkername.rating_system.utils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;
import ru.walkername.rating_system.models.Rating;
import ru.walkername.rating_system.services.RatingsService;

@Component
public class RatingValidator implements Validator {

    private final RatingsService ratingsService;

    @Autowired
    public RatingValidator(RatingsService ratingsService) {
        this.ratingsService = ratingsService;
    }

    @Override
    public boolean supports(Class<?> clazz) {
        return Rating.class.equals(clazz);
    }

    @Override
    public void validate(Object target, Errors errors) {
        Rating rating = (Rating) target;

        if (ratingsService.existsByUserIdAndMovieId(rating.getUserId(), rating.getMovieId())) {
            errors.rejectValue("userId", "", "The rating with this pair of id has already been determined");
            errors.rejectValue("movieId", "", "The rating with this pair of id has already been determined");
        }
    }
}
