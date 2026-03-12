package ru.walkername.feed_service.dto;

import java.time.Instant;

public record PostResponse(
        Long id,
        String title,
        String content,
        Instant publishedAt
) {

}
