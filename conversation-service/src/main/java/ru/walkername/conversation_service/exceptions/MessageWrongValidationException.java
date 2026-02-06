package ru.walkername.conversation_service.exceptions;

public class MessageWrongValidationException extends RuntimeException {
    public MessageWrongValidationException(String message) {
        super(message);
    }
}
