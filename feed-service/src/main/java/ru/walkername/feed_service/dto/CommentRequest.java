package ru.walkername.feed_service.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CommentRequest(
        @NotBlank
        @Size(min = 1, max = 500)
        String content
) {

}
