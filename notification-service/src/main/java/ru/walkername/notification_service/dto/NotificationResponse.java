package ru.walkername.notification_service.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import ru.walkername.notification_service.models.EntityType;
import ru.walkername.notification_service.models.TargetType;

import java.time.Instant;
import java.util.Map;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class NotificationResponse {

    private Long id;

    private TargetType targetType;

    private Long targetId;

    private String title;

    private String message;

    private EntityType entityType;

    private Instant deliveredAt;

    private boolean read;

    private Instant readAt;

    private Map<String, Object> metadata;

}
