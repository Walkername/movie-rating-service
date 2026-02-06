package ru.walkername.conversation_service.exceptions;

public class ChatWrongValidationException extends RuntimeException {
    public ChatWrongValidationException(String message) {
        super(message);
    }
}
