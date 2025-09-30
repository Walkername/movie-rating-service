package ru.walkername.user_profile.dto;

import ru.walkername.user_profile.models.Rating;
import ru.walkername.user_profile.models.User;

public class UserDetails {

    private Long userId;

    private String username;

    private Long movieId;

    private Long ratingId;

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

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getRatingId() {
        return ratingId;
    }

    public void setRatingId(Long ratingId) {
        this.ratingId = ratingId;
    }

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
