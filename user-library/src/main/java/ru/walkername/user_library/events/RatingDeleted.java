package ru.walkername.user_library.events;

public record RatingDeleted(
        Long userId,
        Long movieId,
        int rating
) {

}
