package ru.walkername.movie_catalog.dto;

import java.time.Instant;

public record MovieResponse(
         Long id,
         String title,
         int releaseYear,
         String description,
         double averageRating,
         int scores,
         Long posterPicId,
         String posterPicUrl,
         Instant createdAt
) {

}
