package ru.walkername.user_profile.dto;

import java.util.Date;

public record UserResponse(
        Long id,
        String username,
        String description,
        Integer profilePicId,
        double averageRating,
        int scores,
        Date createdAt
) {

}
