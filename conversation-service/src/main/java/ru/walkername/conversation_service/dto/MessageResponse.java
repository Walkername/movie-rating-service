package ru.walkername.conversation_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class MessageResponse {

    private Long id;

    private Long chatId;

    private Long userId;

    private String content;

    private Instant sentAt;

}
