package ru.walkername.conversation_service.dto;

public record ErrorResponse(
        String message,
        long timestamp
) {

}
