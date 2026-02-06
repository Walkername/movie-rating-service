package ru.walkername.conversation_service.dto;

import jakarta.validation.constraints.Size;
import lombok.Data;
import ru.walkername.conversation_service.models.ChatType;

@Data
public class ChatRequest {

    @Size(min = 1, max = 100, message = "Chat name size should be greater than 1 and less or equal than 100")
    private String name;

    private ChatType type;

}
