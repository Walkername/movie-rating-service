package ru.walkername.notification_service.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import ru.walkername.notification_service.models.Notification;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    @Transactional
    @Modifying
    @Query("DELETE FROM Notification WHERE expiresAt < CURRENT_TIMESTAMP")
    void deleteExpired();

}
