package ru.walkername.rating_system.events;

import java.time.Instant;

public record RatingUpdated(
        Long userId,
        Long movieId,
        int rating,
        int oldRating,
        Instant ratedAt
) {

}
