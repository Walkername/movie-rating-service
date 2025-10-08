package ru.walkername.movie_catalog.dto;

import ru.walkername.movie_catalog.models.Movie;

import java.util.Date;

public class MovieByUserResponse {

    private Long userId;

    private Long movieId;

    private String title;

    private int releaseYear;

    private double rating;

    private double averageRating;

    private int scores;

    private Date ratedAt;

    public MovieByUserResponse() {

    }

    public MovieByUserResponse(Movie movie, RatingResponse rating) {
        this.userId = rating.getUserId();
        this.movieId = movie.getId();
        this.rating = rating.getRating();
        this.title = movie.getTitle();
        this.releaseYear = movie.getReleaseYear();
        this.averageRating = movie.getAverageRating();
        this.scores = movie.getScores();
        this.ratedAt = rating.getRatedAt();
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public double getRating() {
        return rating;
    }

    public void setRating(double rating) {
        this.rating = rating;
    }

    public int getReleaseYear() {
        return releaseYear;
    }

    public void setReleaseYear(int releaseYear) {
        this.releaseYear = releaseYear;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Long getMovieId() {
        return movieId;
    }

    public void setMovieId(Long movieId) {
        this.movieId = movieId;
    }

    public double getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(double averageRating) {
        this.averageRating = averageRating;
    }

    public int getScores() {
        return scores;
    }

    public void setScores(int scores) {
        this.scores = scores;
    }

    public void setRatedAt(Date ratedAt) {
        this.ratedAt = ratedAt;
    }

    public Date getRatedAt() {
        return ratedAt;
    }
}
