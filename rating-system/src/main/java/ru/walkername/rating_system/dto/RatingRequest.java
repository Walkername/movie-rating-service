package ru.walkername.rating_system.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

public record RatingRequest(
        Long movieId,

        @Min(value = 1, message = "Rating should be greater than 0")
        @Max(value = 10, message = "Rating should not be greater than 10")
        int rating
) {

}
