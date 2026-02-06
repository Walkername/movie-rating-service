package ru.walkername.conversation_service.exceptions;

public class SupportChatAlreadyExistsException extends RuntimeException {
    public SupportChatAlreadyExistsException(String message) {
        super(message);
    }
}
