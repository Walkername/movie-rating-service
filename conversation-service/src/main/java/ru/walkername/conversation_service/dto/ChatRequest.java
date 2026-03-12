package ru.walkername.conversation_service.dto;

import jakarta.validation.constraints.Size;
import ru.walkername.conversation_service.models.ChatType;

public record ChatRequest(
        @Size(min = 1, max = 100, message = "Chat name size should be greater than 1 and less or equal than 100")
        String name,

        ChatType type
) {

}
