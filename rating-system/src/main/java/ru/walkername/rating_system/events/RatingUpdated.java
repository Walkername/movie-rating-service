package ru.walkername.rating_system.events;

public class RatingUpdated {

    private Long userId;

    private Long movieId;

    private int rating;

    private int oldRating;

    public RatingUpdated() {
    }

    public RatingUpdated(Long userId, Long movieId, int rating, int oldRating) {
        this.userId = userId;
        this.movieId = movieId;
        this.rating = rating;
        this.oldRating = oldRating;
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

}
