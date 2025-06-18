package ru.walkername.rating_system.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

public class RatingDTO {

    private int userId;

    private int movieId;

    @Min(value = 0, message = "Rating should be greater than 0")
    @Max(value = 10, message = "Rating should be less than 10")
    private double rating;

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public int getMovieId() {
        return movieId;
    }

    public void setMovieId(int movieId) {
        this.movieId = movieId;
    }

    public double getRating() {
        return rating;
    }

    public void setRating(double rating) {
        this.rating = rating;
    }
}
