package ru.walkername.rating_system.dto;

public class NewRatingDTO {

    private int userId;

    private int movieId;

    private double rating;

    private double oldRating;

    private boolean update;

    public NewRatingDTO() {}

    public NewRatingDTO(int userId, int movieId, double rating, double oldRating, boolean update) {
        this.userId = userId;
        this.movieId = movieId;
        this.rating = rating;
        this.oldRating = oldRating;
        this.update = update;
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

    public boolean isUpdate() {
        return update;
    }

    public void setUpdate(boolean update) {
        this.update = update;
    }

    public double getRating() {
        return rating;
    }

    public void setRating(double rating) {
        this.rating = rating;
    }

    public double getOldRating() {
        return oldRating;
    }

    public void setOldRating(double oldRating) {
        this.oldRating = oldRating;
    }

}
