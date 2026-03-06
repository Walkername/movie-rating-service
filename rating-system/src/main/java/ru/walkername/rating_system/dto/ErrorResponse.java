package ru.walkername.rating_system.dto;

public record ErrorResponse(
        String message,
        long timestamp
) {

}
