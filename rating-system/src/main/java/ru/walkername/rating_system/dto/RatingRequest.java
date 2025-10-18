package ru.walkername.rating_system.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

public class RatingRequest {

    private Long movieId;

    @Min(value = 0, message = "Rating should be greater than 0")
    @Max(value = 10, message = "Rating should not be greater than 10")
    private int rating;

    public Long getMovieId() {
        return movieId;
    }

    public void setMovieId(Long movieId) {
        this.movieId = movieId;
    }

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }
}
