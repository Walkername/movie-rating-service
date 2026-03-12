package ru.walkername.feed_service.dto;

public record ErrorResponse(
        String message,
        long timestamp
) {

}
