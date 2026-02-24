package ru.walkername.movie_catalog.events;

import java.time.Instant;

public record RatingCreated(
        Long userId,
        Long movieId,
        int rating,
        Instant ratedAt
) {

}
