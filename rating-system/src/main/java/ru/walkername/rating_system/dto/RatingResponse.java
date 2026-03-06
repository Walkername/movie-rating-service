package ru.walkername.rating_system.dto;

import java.time.Instant;

public record RatingResponse(
        Long userId,
        Long movieId,
        Integer rating,
        Instant ratedAt
) {

}
