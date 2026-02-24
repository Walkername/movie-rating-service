package ru.walkername.movie_catalog.dto;

import java.time.Instant;

public record RatingResponse(
        Long userId,
        Long movieId,
        int rating,
        Instant ratedAt
) {

}
