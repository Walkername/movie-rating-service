package ru.walkername.user_profile.events;

public record RatingDeleted(
        Long userId,
        Long movieId,
        int rating
) {

}
