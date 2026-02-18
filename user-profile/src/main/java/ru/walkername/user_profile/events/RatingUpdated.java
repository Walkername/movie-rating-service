package ru.walkername.user_profile.events;

public record RatingUpdated(
        Long userId,
        Long movieId,
        int rating,
        int oldRating
) {

}
