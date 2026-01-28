package ru.walkername.notification_service.exceptions;

public class NotificationNotFound extends RuntimeException {
    public NotificationNotFound(String message) {
        super(message);
    }
}
