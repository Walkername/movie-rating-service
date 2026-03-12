package ru.walkername.feed_service.dto;

public record UserResponse(
        Long id,
        String username,
        String description,
        Integer profilePicId,
        double averageRating,
        int scores
) {

}
