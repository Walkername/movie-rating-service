package ru.walkername.notification_service.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import ru.walkername.notification_service.dto.UserNotificationResponse;
import ru.walkername.notification_service.models.UserNotification;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserNotificationRepository extends JpaRepository<UserNotification, Long> {

    @Transactional
    @Modifying
    @Query(value = """
            INSERT INTO user_notification (user_id, notification_id, is_read, delivered_at, expires_at)
            SELECT
                :userId,
                n.id,
                false,
                n.created_at,
                n.expires_at
            FROM notification n
            WHERE
                (
                    n.target_type = 'ALL'
                    OR (n.target_type = 'USER' AND n.target_id = :userId)
                )
            AND NOT EXISTS (
                SELECT 1
                FROM user_notification un
                WHERE un.user_id = :userId
                  AND un.notification_id = n.id
            );
            
            """, nativeQuery = true)
    int createMissingUserNotifications(@Param("userId") Long userId);

    @Query("""
            SELECT new ru.walkername.notification_service.dto.UserNotificationResponse(
                        un.id,
                        n.id,
                        n.entityType,
                        n.title,
                        n.message,
                        un.read,
                        un.readAt,
                        un.deliveredAt,
                        un.expiresAt
                                    )
                    FROM UserNotification un
                    JOIN Notification n ON n.id = un.notificationId
                    WHERE un.userId = :userId
                    ORDER BY n.createdAt DESC
            """)
    Page<UserNotificationResponse> findUserNotifications(
            @Param("userId") Long userId,
            Pageable pageable
    );

    Optional<UserNotification> findByNotificationIdAndUserId(Long notificationId, Long userId);

    @Transactional
    @Modifying
    @Query("UPDATE UserNotification un SET un.read = true, un.readAt = CURRENT_TIMESTAMP WHERE un.id IN :ids")
    void markAsReadByIds(List<Long> ids);

    @Transactional
    @Modifying
    @Query("DELETE FROM UserNotification WHERE expiresAt < CURRENT_TIMESTAMP")
    void deleteExpired();

}
