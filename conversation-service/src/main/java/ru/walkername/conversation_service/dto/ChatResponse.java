package ru.walkername.conversation_service.dto;

import ru.walkername.conversation_service.models.ChatType;

import java.time.Instant;

public record ChatResponse(
        Long id,
        String name,
        ChatType type,
        Instant createdAt
) {

}
