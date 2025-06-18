package ru.walkername.user_profile.dto;

import ru.walkername.user_profile.models.Rating;

import java.util.List;

public class RatingsResponse {

    private List<Rating> ratings;

    public List<Rating> getRatings() {
        return ratings;
    }

    public void setRatings(List<Rating> ratings) {
        this.ratings = ratings;
    }
}
