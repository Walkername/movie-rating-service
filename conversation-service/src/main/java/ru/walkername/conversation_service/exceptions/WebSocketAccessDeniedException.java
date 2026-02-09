package ru.walkername.conversation_service.exceptions;

public class WebSocketAccessDeniedException extends RuntimeException {
    public WebSocketAccessDeniedException(String message) {
        super(message);
    }
}
