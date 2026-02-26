package ru.walkername.user_profile.dto;

import java.time.Instant;

public record UserResponse(
        Long id,
        String username,
        String description,
        Integer profilePicId,
        double averageRating,
        int scores,
        Instant createdAt
) {

}
