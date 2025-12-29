package ru.walkername.feed_service.exceptions;

public class PostWrongValidationException extends RuntimeException {
    public PostWrongValidationException(String message) {
        super(message);
    }
}
