package ru.walkername.user_profile.events;

public record RatingCreated(
        Long userId,
        Long movieId,
        int rating
) {

}
