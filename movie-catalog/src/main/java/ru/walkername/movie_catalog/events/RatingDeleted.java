package ru.walkername.movie_catalog.events;

public record RatingDeleted(
        Long userId,
        Long movieId,
        int rating
) {

}
