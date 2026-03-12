package ru.walkername.conversation_service.dto;

import java.time.Instant;

public record MessageResponse(
        Long id,
        Long chatId,
        Long userId,
        String content,
        Instant sentAt
) {

}
