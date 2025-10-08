package ru.walkername.movie_catalog.dto;

import java.util.Date;

public class RatingResponse {

    private Long userId;

    private Long movieId;

    private int rating;

    private Date ratedAt;

    public RatingResponse() {
    }

    public RatingResponse(Long userId, Long movieId, int rating, Date ratedAt) {
        this.userId = userId;
        this.movieId = movieId;
        this.rating = rating;
        this.ratedAt = ratedAt;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

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

    public Date getRatedAt() {
        return ratedAt;
    }

    public void setRatedAt(Date ratedAt) {
        this.ratedAt = ratedAt;
    }

}
