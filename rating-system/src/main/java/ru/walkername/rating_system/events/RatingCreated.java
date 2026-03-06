package ru.walkername.rating_system.events;

import java.time.Instant;

public record RatingCreated(
        Long userId,
        Long movieId,
        int rating,
        Instant ratedAt
) {

}
