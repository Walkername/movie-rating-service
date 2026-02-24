package ru.walkername.movie_catalog.dto;

public record ErrorResponse(
        String message,
        long timestamp
) {

}
