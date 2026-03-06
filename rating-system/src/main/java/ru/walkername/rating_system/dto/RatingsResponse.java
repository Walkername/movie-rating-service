package ru.walkername.rating_system.dto;

public record RatingsResponse(
        PageResponse<RatingResponse> pageResponse
) {

}
