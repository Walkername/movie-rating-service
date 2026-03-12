package ru.walkername.conversation_service.mapper;

import org.mapstruct.Mapper;
import ru.walkername.conversation_service.dto.ChatRequest;
import ru.walkername.conversation_service.dto.ChatResponse;
import ru.walkername.conversation_service.models.Chat;

@Mapper(componentModel = "spring")
public interface ChatMapper {

    Chat toChat(ChatRequest chatRequest);

    ChatResponse toChatResponse(Chat chat);

}
