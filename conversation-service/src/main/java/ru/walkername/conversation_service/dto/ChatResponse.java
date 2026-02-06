package ru.walkername.conversation_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import ru.walkername.conversation_service.models.ChatType;

import java.time.Instant;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class ChatResponse {

    private Long id;

    private String name;

    private ChatType type;

    private Instant createdAt;

}
