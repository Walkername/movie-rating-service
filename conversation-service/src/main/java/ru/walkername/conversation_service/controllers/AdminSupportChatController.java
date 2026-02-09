package ru.walkername.conversation_service.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.walkername.conversation_service.dto.AdminChatResponse;
import ru.walkername.conversation_service.services.AdminSupportChatService;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/admin/support-chats")
public class AdminSupportChatController {

    private final AdminSupportChatService adminSupportChatService;

    @GetMapping()
    public ResponseEntity<List<AdminChatResponse>> index() {
        List<AdminChatResponse> adminChatResponses = adminSupportChatService.findAll();
        return new ResponseEntity<>(adminChatResponses, HttpStatus.OK);
    }

}
