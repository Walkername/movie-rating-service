package ru.walkername.rating_system.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

public class RatingRequest {

    private Long movieId;

    @Min(value = 0, message = "Rating should be greater than 0")
    @Max(value = 10, message = "Rating should be less than 10")
    private double rating;

    public Long getMovieId() {
        return movieId;
    }

    public void setMovieId(Long movieId) {
        this.movieId = movieId;
    }

    public double getRating() {
        return rating;
    }

    public void setRating(double rating) {
        this.rating = rating;
    }
}
