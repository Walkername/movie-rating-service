package ru.walkername.rating_system.dto;

public class NewRatingDTO {

    private double rating;

    private double oldRating;

    private boolean update;

    public NewRatingDTO() {}

    public NewRatingDTO(double rating, double oldRating, boolean update) {
        this.rating = rating;
        this.oldRating = oldRating;
        this.update = update;
    }

    public boolean isUpdate() {
        return update;
    }

    public void setUpdate(boolean update) {
        this.update = update;
    }

    public double getRating() {
        return rating;
    }

    public void setRating(double rating) {
        this.rating = rating;
    }

    public double getOldRating() {
        return oldRating;
    }

    public void setOldRating(double oldRating) {
        this.oldRating = oldRating;
    }

}
