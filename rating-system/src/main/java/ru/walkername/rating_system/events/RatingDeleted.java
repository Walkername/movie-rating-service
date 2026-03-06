package ru.walkername.rating_system.events;

public record RatingDeleted(
        Long userId,
        Long movieId,
        int rating
) {

}
