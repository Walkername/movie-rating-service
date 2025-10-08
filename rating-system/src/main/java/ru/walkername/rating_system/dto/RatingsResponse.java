package ru.walkername.rating_system.dto;

public class RatingsResponse {

    private PageResponse<RatingResponse> pageResponse;

    public RatingsResponse(PageResponse<RatingResponse> pageResponse) {
        this.pageResponse = pageResponse;
    }

    public PageResponse<RatingResponse> getPageResponse() {
        return pageResponse;
    }

    public void setPageResponse(PageResponse<RatingResponse> pageResponse) {
        this.pageResponse = pageResponse;
    }
}
