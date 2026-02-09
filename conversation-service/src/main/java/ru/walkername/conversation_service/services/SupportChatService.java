package ru.walkername.conversation_service.services;

import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.walkername.conversation_service.exceptions.ChatNotFoundException;
import ru.walkername.conversation_service.models.Chat;
import ru.walkername.conversation_service.models.ChatType;
import ru.walkername.conversation_service.repositories.ChatRepository;

import java.time.Instant;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class SupportChatService {

    private final ChatRepository chatRepository;

    private final ChatService chatService;

    @Transactional(readOnly = true)
    public Chat get(Long userId) {
        return chatRepository.findOneByUserIdWithTypeSupport(userId).orElseThrow(
                () -> new ChatNotFoundException("Chat not found")
        );
    }

    public Chat create(Long userId) {
        Optional<Chat> supportChat = chatRepository.findOneByUserIdWithTypeSupport(userId);
        if (supportChat.isPresent()) {
            return supportChat.get();
        }

        Chat chat = new Chat();
        chat.setName("Support Chat");
        chat.setOwnerId(userId);
        chat.setType(ChatType.SUPPORT);
        chat.setCreatedAt(Instant.now());

        try {
            return chatService.save(chat, userId);
        } catch (DataIntegrityViolationException ex) {
            return chatRepository.findOneByUserIdWithTypeSupport(userId).orElseThrow(
                    () -> new ChatNotFoundException("Chat not found")
            );
        }
    }

}
