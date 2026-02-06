package ru.walkername.conversation_service.util;

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;
import ru.walkername.conversation_service.dto.MessageRequest;
import ru.walkername.conversation_service.dto.MessageResponse;
import ru.walkername.conversation_service.models.Message;

@RequiredArgsConstructor
@Component
public class MessageModelMapper {

    private final ModelMapper modelMapper;

    public Message toMessage(MessageRequest messageRequest) {
        return modelMapper.map(messageRequest, Message.class);
    }

    public MessageResponse toMessageResponse(Message message) {
        return modelMapper.map(message, MessageResponse.class);
    }

}
