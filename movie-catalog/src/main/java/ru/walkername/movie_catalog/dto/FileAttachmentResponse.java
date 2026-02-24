package ru.walkername.movie_catalog.dto;

import java.time.Instant;

public record FileAttachmentResponse(
        Long entityId,
        String url,
        Instant uploadedAt
) {

}
