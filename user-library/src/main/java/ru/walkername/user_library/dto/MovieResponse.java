package ru.walkername.user_library.dto;

import java.time.Instant;

public record MovieResponse(
        Long id,
        String title,
        int releaseYear,
        String description,
        double averageRating,
        int scores,
        Long posterPicId,
        Instant createdAt
) {

}
