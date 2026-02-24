package ru.walkername.movie_catalog.events;

public record MovieUpdated(
        Long id,
        String title,
        int releaseYear
) {

}
