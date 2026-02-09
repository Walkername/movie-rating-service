package ru.walkername.conversation_service.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.walkername.conversation_service.dto.AdminChatResponse;
import ru.walkername.conversation_service.repositories.ChatRepository;

import java.util.List;

@RequiredArgsConstructor
@Service
@Transactional(readOnly=true)
public class AdminSupportChatService {

    private final ChatRepository chatRepository;

    public List<AdminChatResponse> findAll() {
        return chatRepository.findAllWithTypeSupport();
    }

}
