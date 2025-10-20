package ru.walkername.movie_catalog.events;

public class RatingDeleted {

    private Long userId;

    private Long movieId;

    private int rating;

    public RatingDeleted() {
    }

    public RatingDeleted(Long userId, Long movieId, int rating) {
        this.userId = userId;
        this.movieId = movieId;
        this.rating = rating;
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
}
