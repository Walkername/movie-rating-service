package ru.walkername.user_library.events;

public record MovieRatingUpdated(
        Long id,
        double averageRating,
        int scores
) {

}
