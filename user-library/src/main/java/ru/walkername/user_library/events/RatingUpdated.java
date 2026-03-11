package ru.walkername.user_library.events;

import java.time.Instant;

public record RatingUpdated(
        Long userId,
        Long movieId,
        int rating,
        int oldRating,
        Instant ratedAt
) {

}
