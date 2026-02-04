package ru.walkername.conversation_service.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.walkername.conversation_service.models.Chat;

@Repository
public interface ChatRepository extends JpaRepository<Chat, Long> {
}
