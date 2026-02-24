package ru.walkername.movie_catalog.dto;

import ru.walkername.movie_catalog.models.Movie;

import java.time.Instant;


public record MovieByUserResponse(
        Long userId,
        Long movieId,
        String title,
        int releaseYear,
        double rating,
        double averageRating,
        int scores,
        Instant ratedAt
) {

    public MovieByUserResponse(Movie movie, RatingResponse rating) {
        this(
                rating.userId(),
                movie.getId(),
                movie.getTitle(),
                movie.getReleaseYear(),
                rating.rating(),
                movie.getAverageRating(),
                movie.getScores(),
                rating.ratedAt()
        );
    }
}
