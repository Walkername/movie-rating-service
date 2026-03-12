package ru.walkername.feed_service.dto;

import java.time.Instant;

public record CommentResponse(
        Long id,
        Long postId,
        Long userId,
        String username,
        String content,
        Instant publishedAt
) {

}
