package ru.walkername.notification_service.dto;

import ru.walkername.notification_service.models.EntityType;
import ru.walkername.notification_service.models.TargetType;

import java.time.Instant;
import java.util.Map;

public record NotificationResponse(
        Long id,
        TargetType targetType,
        Long targetId,
        String title,
        String message,
        EntityType entityType,
        Instant createdAt,
        boolean read,
        Map<String, Object> metadata
) {

}
