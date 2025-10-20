package ru.walkername.user_library.exceptions;

public class UserRatedMovieNotFound extends RuntimeException {
    public UserRatedMovieNotFound(String message) {
        super(message);
    }
}
