package ru.walkername.movie_catalog.events;

public record FileUploaded(
        Long fileId,
        Long contextId,
        String context
) {

}
