package ru.walkername.conversation_service.util;

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;
import ru.walkername.conversation_service.dto.ChatRequest;
import ru.walkername.conversation_service.dto.ChatResponse;
import ru.walkername.conversation_service.models.Chat;

@RequiredArgsConstructor
@Component
public class ChatModelMapper {

    private final ModelMapper modelMapper;

    public Chat toChat(ChatRequest chatRequest) {
        return modelMapper.map(chatRequest, Chat.class);
    }

    public ChatResponse toChatResponse(Chat chat) {
        return modelMapper.map(chat, ChatResponse.class);
    }

}
