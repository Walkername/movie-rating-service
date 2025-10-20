package ru.walkername.user_library.dto;

import java.util.Date;

public class UserRatedMovieResponse {

    private String id;

    private Long userId;

    private Long movieId;

    private int rating;

    private Date ratedAt;

    // Movie Fields

    private String movieTitle;

    private int movieReleaseYear;

    private double movieAverageRating;

    private int movieScores;

    private Date movieCreatedAt;

    public UserRatedMovieResponse() {
    }

    public UserRatedMovieResponse(
            String id,
            Long userId,
            Long movieId,
            int rating,
            Date ratedAt,
            String movieTitle,
            int movieReleaseYear,
            double movieAverageRating,
            int movieScores,
            Date movieCreatedAt
    ) {
        this.id = id;
        this.userId = userId;
        this.movieId = movieId;
        this.rating = rating;
        this.ratedAt = ratedAt;
        this.movieTitle = movieTitle;
        this.movieReleaseYear = movieReleaseYear;
        this.movieAverageRating = movieAverageRating;
        this.movieScores = movieScores;
        this.movieCreatedAt = movieCreatedAt;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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

    public String getMovieTitle() {
        return movieTitle;
    }

    public void setMovieTitle(String movieTitle) {
        this.movieTitle = movieTitle;
    }

    public int getMovieReleaseYear() {
        return movieReleaseYear;
    }

    public void setMovieReleaseYear(int movieReleaseYear) {
        this.movieReleaseYear = movieReleaseYear;
    }

    public double getMovieAverageRating() {
        return movieAverageRating;
    }

    public void setMovieAverageRating(double movieAverageRating) {
        this.movieAverageRating = movieAverageRating;
    }

    public int getMovieScores() {
        return movieScores;
    }

    public void setMovieScores(int movieScores) {
        this.movieScores = movieScores;
    }

    public Date getMovieCreatedAt() {
        return movieCreatedAt;
    }

    public void setMovieCreatedAt(Date movieCreatedAt) {
        this.movieCreatedAt = movieCreatedAt;
    }

}
