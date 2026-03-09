package ru.walkername.file_service.dto;

public record ErrorResponse(
        String message,
        long timestamp
) {

}
