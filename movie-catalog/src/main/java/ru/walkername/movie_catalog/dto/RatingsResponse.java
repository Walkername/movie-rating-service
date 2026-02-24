package ru.walkername.movie_catalog.dto;

public record RatingsResponse(
        PageResponse<RatingResponse> pageResponse
) {

}
