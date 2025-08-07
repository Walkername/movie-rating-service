package ru.walkername.movie_catalog.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

public class NewRatingDTO {

    private int userId;

    private int movieId;

    @Min(value = 0, message = "Rating should be greater than 0")
    @Max(value = 10, message = "Rating should be less than 10")
    private double rating;

    @Min(value = 0, message = "Rating should be greater than 0")
    @Max(value = 10, message = "Rating should be less than 10")
    private double oldRating;

    private boolean update;

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

    public boolean isUpdate() {
        return update;
    }

    public void setUpdate(boolean update) {
        this.update = update;
    }

    public double getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }

    public double getOldRating() {
        return oldRating;
    }

    public void setOldRating(int oldRating) {
        this.oldRating = oldRating;
    }

    @Override
    public String toString() {
        return "NewRatingDTO{" +
                "userId=" + userId +
                ", movieId=" + movieId +
                ", rating=" + rating +
                ", oldRating=" + oldRating +
                ", update=" + update +
                '}';
    }

}
