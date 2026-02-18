package ru.walkername.user_profile.dto;

public record ErrorResponse(
        String message,
        long timestamp
) {

}