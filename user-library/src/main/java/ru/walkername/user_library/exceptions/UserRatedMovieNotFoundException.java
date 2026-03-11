package ru.walkername.user_library.exceptions;

public class UserRatedMovieNotFoundException extends RuntimeException {
    public UserRatedMovieNotFoundException(String message) {
        super(message);
    }
}
