package ru.walkername.notification_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import ru.walkername.notification_service.models.EntityType;

import java.time.Instant;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class UserNotificationResponse {

    private Long id;

    private Long notificationId;

    private EntityType entityType;

    private String title;

    private String message;

    private boolean isRead;

    private Instant readAt;

    private Instant deliveredAt;

    private Instant expiresAt;

}
