package ru.walkername.rating_system.dto;

import java.util.Date;

public class RatingResponse {

    private int userId;

    private int movieId;

    private int rating;

    private Date ratedAt;

    public RatingResponse() {
    }

    public RatingResponse(int userId, int movieId, int rating, Date ratedAt) {
        this.userId = userId;
        this.movieId = movieId;
        this.rating = rating;
        this.ratedAt = ratedAt;
    }

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

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }

    public Date getRatedAt() {
        return ratedAt;
    }

    public void setRatedAt(Date ratedAt) {
        this.ratedAt = ratedAt;
    }
}
