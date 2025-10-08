package ru.walkername.movie_catalog.dto;

public class RatingsResponse {

    private PageResponse<RatingResponse> pageResponse;

    public PageResponse<RatingResponse> getPageResponse() {
        return pageResponse;
    }

    public void setPageResponse(PageResponse<RatingResponse> pageResponse) {
        this.pageResponse = pageResponse;
    }
}
