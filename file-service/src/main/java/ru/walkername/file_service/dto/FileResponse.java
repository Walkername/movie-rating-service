package ru.walkername.file_service.dto;

import java.time.Instant;

public record FileResponse(
        Long fileId,
        String url,
        Instant uploadedAt
) {

}
