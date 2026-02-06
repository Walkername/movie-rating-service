package ru.walkername.conversation_service.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.walkername.conversation_service.exceptions.ChatNotFoundException;
import ru.walkername.conversation_service.exceptions.SupportChatAlreadyExistsException;
import ru.walkername.conversation_service.models.Chat;
import ru.walkername.conversation_service.models.ChatParticipant;
import ru.walkername.conversation_service.models.ChatType;
import ru.walkername.conversation_service.repositories.ChatParticipantRepository;
import ru.walkername.conversation_service.repositories.ChatRepository;

import java.time.Instant;
import java.util.Optional;

@RequiredArgsConstructor
@Service
@Transactional(readOnly=true)
public class SupportChatService {

    private final ChatRepository chatRepository;
    private final ChatParticipantRepository chatParticipantRepository;

    public Chat get(Long userId) {
        return chatRepository.findOneByUserIdWithTypeSupport(userId).orElseThrow(
                () -> new ChatNotFoundException("Chat not found")
        );
    }

    @Transactional
    public Chat create(Long userId) {
        Optional<Chat> supportChat = chatRepository.findOneByUserIdWithTypeSupport(userId);
        if (supportChat.isPresent()) {
            throw new SupportChatAlreadyExistsException("Support chat already exists");
        }

        Chat chat = new Chat();
        chat.setName("Support Chat");
        chat.setType(ChatType.SUPPORT);
        chat.setCreatedAt(Instant.now());
        Chat savedChat = chatRepository.save(chat);

        createChatParticipant(savedChat.getId(), userId);

        return savedChat;
    }

    private void createChatParticipant(Long chatId, Long userId) {
        ChatParticipant chatParticipant = new ChatParticipant();
        chatParticipant.setUserId(userId);
        chatParticipant.setChatId(chatId);
        chatParticipant.setJoinedAt(Instant.now());
        chatParticipantRepository.save(chatParticipant);
    }

}
