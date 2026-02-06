package ru.walkername.conversation_service.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.walkername.conversation_service.exceptions.ChatNotFoundException;
import ru.walkername.conversation_service.models.Chat;
import ru.walkername.conversation_service.models.ChatParticipant;
import ru.walkername.conversation_service.models.ChatType;
import ru.walkername.conversation_service.repositories.ChatParticipantRepository;
import ru.walkername.conversation_service.repositories.ChatRepository;

import java.time.Instant;

@RequiredArgsConstructor
@Service
@Transactional(readOnly = true)
public class ChatService {

    private final ChatRepository chatRepository;
    private final ChatParticipantRepository chatParticipantRepository;

    public Chat findOne(Long chatId, Long userId) {
        return chatRepository.findOneByChatIdAndUserId(chatId, userId).orElseThrow(
                () -> new ChatNotFoundException("Chat not found")
        );
    }

    @Transactional
    public Chat save(Chat chat, Long userId) {
        chat.setType(ChatType.GROUP);
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

    @Transactional
    public Chat update(Long id, Chat updatedChat) {
        Chat chat = chatRepository.findById(id).orElseThrow(
                () -> new ChatNotFoundException("Chat not found")
        );

        chat.setName(updatedChat.getName());

        return chat;
    }

    @Transactional
    public void delete(Long id) {
        Chat chat = chatRepository.findById(id).orElseThrow(
                () -> new ChatNotFoundException("Chat not found")
        );

        chatRepository.delete(chat);
    }

}
