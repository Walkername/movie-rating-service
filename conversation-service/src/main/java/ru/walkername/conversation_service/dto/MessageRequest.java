package ru.walkername.conversation_service.dto;

import lombok.Data;

@Data
public class MessageRequest {

    private Long chatId;

    private String content;

}
