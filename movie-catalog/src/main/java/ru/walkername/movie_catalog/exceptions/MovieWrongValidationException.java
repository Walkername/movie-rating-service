package ru.walkername.movie_catalog.exceptions;

public class MovieWrongValidationException extends RuntimeException {

    public MovieWrongValidationException(String msg) {
        super(msg);
    }

}
