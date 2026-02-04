package ru.walkername.conversation_service.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.walkername.conversation_service.models.Message;

@Repository
public interface MessageRepository extends JpaRepository<Message,Long> {
}
