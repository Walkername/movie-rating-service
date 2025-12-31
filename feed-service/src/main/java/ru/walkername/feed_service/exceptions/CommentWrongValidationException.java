package ru.walkername.feed_service.exceptions;

public class CommentWrongValidationException extends RuntimeException {
    public CommentWrongValidationException(String message) {
        super(message);
    }
}
