package ru.walkername.user_library.events;

import java.time.Instant;

public record RatingCreated(
        Long userId,
        Long movieId,
        int rating,
        Instant ratedAt
) {

}
