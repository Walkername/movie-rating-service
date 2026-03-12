package ru.walkername.notification_service.dto;

import ru.walkername.notification_service.models.EntityType;

import java.time.Instant;

public record UserNotificationResponse(
        Long id,
        Long notificationId,
        EntityType entityType,
        String title,
        String message,
        boolean isRead,
        Instant readAt,
        Instant deliveredAt,
        Instant expiresAt
) {

}
