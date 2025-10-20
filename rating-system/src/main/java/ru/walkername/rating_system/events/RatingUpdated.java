package ru.walkername.rating_system.events;

import java.util.Date;

public class RatingUpdated {

    private Long userId;

    private Long movieId;

    private int rating;

    private int oldRating;

    private Date ratedAt;

    public RatingUpdated() {
    }

    public RatingUpdated(Long userId, Long movieId, int rating, int oldRating, Date ratedAt) {
        this.userId = userId;
        this.movieId = movieId;
        this.rating = rating;
        this.oldRating = oldRating;
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

    public int getOldRating() {
        return oldRating;
    }

    public void setOldRating(int oldRating) {
        this.oldRating = oldRating;
    }

    public Date getRatedAt() {
        return ratedAt;
    }

    public void setRatedAt(Date ratedAt) {
        this.ratedAt = ratedAt;
    }
}
