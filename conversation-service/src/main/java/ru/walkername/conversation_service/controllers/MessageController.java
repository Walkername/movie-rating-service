package ru.walkername.conversation_service.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.walkername.conversation_service.dto.MessageRequest;
import ru.walkername.conversation_service.dto.MessageResponse;
import ru.walkername.conversation_service.mapper.MessageMapper;
import ru.walkername.conversation_service.models.Message;
import ru.walkername.conversation_service.security.UserPrincipal;
import ru.walkername.conversation_service.services.MessageService;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/chats/{chatId}/messages")
public class MessageController {

    private final MessageService messageService;
    private final MessageMapper messageMapper;

    @PostMapping()
    public ResponseEntity<Message> save(
            @PathVariable Long chatId,
            @RequestBody MessageRequest messageRequest,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        Message message = messageMapper.toMessage(messageRequest);

        Message savedMessage = messageService.send(message, chatId, userPrincipal);

        return new ResponseEntity<>(savedMessage, HttpStatus.CREATED);
    }

    @GetMapping()
    public ResponseEntity<List<MessageResponse>> getMessagesByChat(
            @PathVariable Long chatId
    ) {
        List<Message> messages = messageService.findMessagesByChatId(chatId);
        List<MessageResponse> messageResponses = messages.stream().map(messageMapper::toMessageResponse).toList();
        return new ResponseEntity<>(messageResponses, HttpStatus.OK);
    }

}
