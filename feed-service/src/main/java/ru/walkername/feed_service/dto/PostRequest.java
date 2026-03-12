package ru.walkername.feed_service.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record PostRequest(
        @NotBlank
        @Size(min = 5, max = 50)
        String title,

        @NotBlank
        @Size(min = 5, max = 500)
        String content
) {

}
