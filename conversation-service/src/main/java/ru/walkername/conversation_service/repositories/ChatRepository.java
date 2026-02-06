package ru.walkername.conversation_service.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import ru.walkername.conversation_service.models.Chat;

import java.util.Optional;

@Repository
public interface ChatRepository extends JpaRepository<Chat, Long> {

    @Query(value = "SELECT c FROM Chat c JOIN ChatParticipant cp ON c.id = :chatId WHERE cp.userId = :userId")
    Optional<Chat> findOneByChatIdAndUserId(Long chatId, Long userId);

    @Query(value = "SELECT c FROM Chat c JOIN ChatParticipant cp ON cp.userId = :userId WHERE c.type = ru.walkername.conversation_service.models.ChatType.SUPPORT")
    Optional<Chat> findOneByUserIdWithTypeSupport(Long userId);

}
