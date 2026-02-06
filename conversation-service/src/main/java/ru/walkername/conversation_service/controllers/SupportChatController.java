package ru.walkername.conversation_service.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.walkername.conversation_service.dto.ChatResponse;
import ru.walkername.conversation_service.models.Chat;
import ru.walkername.conversation_service.security.UserPrincipal;
import ru.walkername.conversation_service.services.SupportChatService;
import ru.walkername.conversation_service.util.ChatModelMapper;

@RequiredArgsConstructor
@RestController
@RequestMapping("/support-chats")
public class SupportChatController {

    private final SupportChatService supportChatService;
    private final ChatModelMapper chatModelMapper;

    @GetMapping()
    public ResponseEntity<ChatResponse> get(
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        Chat chat = supportChatService.get(userPrincipal.getUserId());
        ChatResponse chatResponse = chatModelMapper.toChatResponse(chat);
        return new ResponseEntity<>(chatResponse, HttpStatus.OK);
    }

    @PostMapping()
    public ResponseEntity<ChatResponse> create(
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        Chat chat = supportChatService.create(userPrincipal.getUserId());
        ChatResponse chatResponse = chatModelMapper.toChatResponse(chat);
        return new ResponseEntity<>(chatResponse, HttpStatus.CREATED);
    }

}
