package ru.walkername.conversation_service.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.walkername.conversation_service.exceptions.ChatNotFoundException;
import ru.walkername.conversation_service.models.Chat;
import ru.walkername.conversation_service.models.Message;
import ru.walkername.conversation_service.repositories.ChatRepository;
import ru.walkername.conversation_service.repositories.MessageRepository;

import java.time.Instant;
import java.util.List;

@RequiredArgsConstructor
@Service
@Transactional
public class MessageService {

    private final MessageRepository messageRepository;

    private final ChatRepository chatRepository;

    @Transactional
    public Message save(Message message, Long chatId) {
        Chat chat = chatRepository.findById(chatId).orElseThrow(
                () -> new ChatNotFoundException("Chat not found")
        );
        message.setChat(chat);
        message.setSentAt(Instant.now());
        return messageRepository.save(message);
    }

    public List<Message> findMessagesByChatId(Long chatId, Long userId) {
        Chat chat = chatRepository.findOneByChatIdAndUserId(chatId, userId).orElseThrow(
                () -> new ChatNotFoundException("Chat not found")
        );

        return chat.getMessages();
    }

}
