package ru.walkername.conversation_service.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import ru.walkername.conversation_service.dto.AdminChatResponse;
import ru.walkername.conversation_service.models.Chat;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatRepository extends JpaRepository<Chat, Long> {

    @Query(value = "SELECT c FROM Chat c JOIN ChatParticipant cp ON c.id = cp.chatId WHERE c.id = :chatId AND cp.userId = :userId")
    Optional<Chat> findOneByChatIdAndUserId(Long chatId, Long userId);

    @Query(value = "SELECT c FROM Chat c JOIN ChatParticipant cp ON c.id = cp.chatId WHERE cp.userId = :userId AND c.id = cp.chatId AND c.type = ru.walkername.conversation_service.models.ChatType.SUPPORT")
    Optional<Chat> findOneByUserIdWithTypeSupport(Long userId);

    @Query(value = """
            SELECT new ru.walkername.conversation_service.dto.AdminChatResponse(
                        c.id,
                        cn.userId,
                        c.name,
                        c.type,
                        c.createdAt
                    )
                    FROM Chat c
                    JOIN ChatParticipant cn
                    ON c.id = cn.chatId
                    WHERE c.type = ru.walkername.conversation_service.models.ChatType.SUPPORT
            """)
    List<AdminChatResponse> findAllWithTypeSupport();

}
