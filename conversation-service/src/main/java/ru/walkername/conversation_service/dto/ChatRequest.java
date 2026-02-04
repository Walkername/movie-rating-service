package ru.walkername.conversation_service.dto;

import lombok.Data;
import ru.walkername.conversation_service.models.ChatType;

@Data
public class ChatRequest {

    private String name;

    private ChatType type;

}
