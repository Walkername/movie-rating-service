package ru.walkername.rating_system.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

import java.util.Date;

@Entity
@Table(name = "rating", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "movie_id"})
})
public class Rating {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "rating_id")
    private int ratingId;

    @Column(name = "user_id")
    private int userId;

    @Column(name = "movie_id")
    private int movieId;

    @Min(value = 1, message = "Rating should be greater than 0")
    @Max(value = 10, message = "Rating should be less than 10")
    @Column(name = "rating")
    private int rating;

    @Column(name = "rated_at")
    private Date ratedAt;

    public Rating() {

    }

    public Rating(int userId, int movieId, int rating) {
        this.userId = userId;
        this.movieId = movieId;
        this.rating = rating;
    }

    public int getRatingId() {
        return ratingId;
    }

    public void setRatingId(int ratingId) {
        this.ratingId = ratingId;
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

    @Override
    public String toString() {
        return "Rating{" +
                "ratingId=" + ratingId +
                ", userId=" + userId +
                ", movieId=" + movieId +
                ", rating=" + rating +
                ", ratedAt=" + ratedAt +
                '}';
    }
}
