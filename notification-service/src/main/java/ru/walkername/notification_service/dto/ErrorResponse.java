package ru.walkername.notification_service.dto;

public record ErrorResponse(
        String message,
        long timestamp
) {

}

