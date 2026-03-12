package ru.walkername.conversation_service.mapper;

import org.mapstruct.Mapper;
import ru.walkername.conversation_service.dto.MessageRequest;
import ru.walkername.conversation_service.dto.MessageResponse;
import ru.walkername.conversation_service.models.Message;

@Mapper(componentModel = "spring")
public interface MessageMapper {

    Message toMessage(MessageRequest messageRequest);

    MessageResponse toMessageResponse(Message message);

}
