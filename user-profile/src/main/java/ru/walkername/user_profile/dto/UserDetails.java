package ru.walkername.user_profile.dto;

import ru.walkername.user_profile.models.Rating;
import ru.walkername.user_profile.models.User;

public class UserDetails {

    private int userId;

    private String username;

    private int movieId;

    private int ratingId;

    private double rating;

    public UserDetails() {

    }

    public UserDetails(User user, Rating rating) {
        this.userId = user.getId();
        this.username = user.getUsername();
        this.movieId = rating.getMovieId();
        this.ratingId = rating.getRatingId();
        this.rating = rating.getRating();
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public int getRatingId() {
        return ratingId;
    }

    public void setRatingId(int ratingId) {
        this.ratingId = ratingId;
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
