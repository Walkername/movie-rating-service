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
import ru.walkername.conversation_service.dto.ChatRequest;
import ru.walkername.conversation_service.dto.ChatResponse;
import ru.walkername.conversation_service.mapper.ChatMapper;
import ru.walkername.conversation_service.models.Chat;
import ru.walkername.conversation_service.security.UserPrincipal;
import ru.walkername.conversation_service.services.ChatService;

@RequiredArgsConstructor
@RestController
@RequestMapping("/chats")
public class ChatController {

    private final ChatService chatService;
    private final ChatMapper chatMapper;

    @GetMapping("/{chatId}")
    public ResponseEntity<ChatResponse> get(
            @PathVariable Long chatId,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        Chat chat = chatService.findOne(chatId, userPrincipal.userId());
        ChatResponse chatResponse = chatMapper.toChatResponse(chat);
        return new ResponseEntity<>(chatResponse, HttpStatus.OK);
    }

    @PostMapping("")
    public ResponseEntity<ChatResponse> create(
            @RequestBody ChatRequest chatRequest,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        Chat chat = chatMapper.toChat(chatRequest);
        Chat savedChat = chatService.save(chat, userPrincipal.userId());
        ChatResponse chatResponse = chatMapper.toChatResponse(savedChat);
        return new ResponseEntity<>(chatResponse, HttpStatus.CREATED);
    }

}
