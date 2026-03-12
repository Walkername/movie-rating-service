package ru.walkername.conversation_service.dto;

import ru.walkername.conversation_service.models.ChatType;

import java.time.Instant;

public record AdminChatResponse(
        Long id,
        Long userId,
        String name,
        ChatType type,
        Instant createdAt
) {

}
