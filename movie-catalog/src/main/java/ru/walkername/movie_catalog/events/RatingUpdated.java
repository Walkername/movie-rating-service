package ru.walkername.movie_catalog.events;

import java.time.Instant;

public record RatingUpdated(
        Long userId,
        Long movieId,
        int rating,
        int oldRating,
        Instant ratedAt
) {

}
