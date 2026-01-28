package ru.walkername.notification_service.models;

import java.time.Instant;

public interface UserNotificationView {
    Long getId();
    Long getNotificationId();
    String getEntityType();
    String getTitle();
    String getMessage();
    boolean isRead();
    Instant getReadAt();
    Instant getDeliveredAt();
}
