package ru.walkername.user_library.dto;

import java.time.Instant;

public record UserRatedMovieResponse(
        String id,
        Long userId,
        Long movieId,
        int rating,
        Instant ratedAt,
        String movieTitle,
        int movieReleaseYear,
        double movieAverageRating,
        int movieScores,
        Instant movieCreatedAt
) {

}
