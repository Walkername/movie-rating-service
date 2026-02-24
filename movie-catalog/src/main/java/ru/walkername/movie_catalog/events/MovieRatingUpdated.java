package ru.walkername.movie_catalog.events;

public record MovieRatingUpdated(
        Long id,
        double averageRating,
        int scores
) {

}
