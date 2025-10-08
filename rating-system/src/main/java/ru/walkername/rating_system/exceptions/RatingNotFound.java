package ru.walkername.rating_system.exceptions;

public class RatingNotFound extends RuntimeException {
    public RatingNotFound(String message) {
        super(message);
    }
}
