package ru.walkername.conversation_service.services;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.walkername.conversation_service.dto.MessageResponse;
import ru.walkername.conversation_service.exceptions.ChatNotFoundException;
import ru.walkername.conversation_service.models.Chat;
import ru.walkername.conversation_service.models.Message;
import ru.walkername.conversation_service.repositories.ChatRepository;
import ru.walkername.conversation_service.repositories.MessageRepository;
import ru.walkername.conversation_service.security.UserPrincipal;
import ru.walkername.conversation_service.util.MessageModelMapper;

import java.time.Instant;
import java.util.List;

@RequiredArgsConstructor
@Service
@Transactional
public class MessageService {

    private final MessageRepository messageRepository;

    private final ChatRepository chatRepository;

    private final SimpMessagingTemplate messagingTemplate;

    private final MessageModelMapper messageModelMapper;

    private final ChatService chatService;

    @Transactional
    public Message send(Message message, Long chatId, UserPrincipal userPrincipal) {
        Chat chat = chatRepository.findById(chatId).orElseThrow(
                () -> new ChatNotFoundException("Chat not found")
        );

        // Check If user has access to chat
        if (!chatService.canAccessChat(chatId, userPrincipal)) {
            throw new ChatNotFoundException("Chat not found");
        }

        message.setUserId(userPrincipal.getUserId());
        message.setChat(chat);
        message.setSentAt(Instant.now());
        Message savedMessage = messageRepository.save(message);

        MessageResponse messageResponse = messageModelMapper.toMessageResponse(savedMessage);

        // Send to WebSocket
        messagingTemplate.convertAndSend(
                "/topic/chat/" + chatId,
                messageResponse
        );

        return savedMessage;
    }

    public List<Message> findMessagesByChatId(Long chatId) {
        Chat chat = chatRepository.findById(chatId).orElseThrow(
                () -> new ChatNotFoundException("Chat not found")
        );

        return chat.getMessages();
    }

}
