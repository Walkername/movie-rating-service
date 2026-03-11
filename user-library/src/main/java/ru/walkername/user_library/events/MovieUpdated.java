package ru.walkername.user_library.events;

public record MovieUpdated(
        Long id,
        String title,
        int releaseYear
) {

}
