package ru.walkername.file_service.dto;

import java.time.Instant;

public record FileAttachmentResponse(
        Long entityId,
        String url,
        Instant uploadedAt
) {

}
