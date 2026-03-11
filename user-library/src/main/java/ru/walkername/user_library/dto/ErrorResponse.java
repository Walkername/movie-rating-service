package ru.walkername.user_library.dto;

public record ErrorResponse(
        String message,
        long timestamp
) {

}
