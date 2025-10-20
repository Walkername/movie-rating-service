package ru.walkername.user_library.events;

public class MovieRatingUpdated {

    private Long id;

    private double averageRating;

    private int scores;

    public MovieRatingUpdated() {
    }

    public MovieRatingUpdated(Long id, double averageRating, int scores) {
        this.id = id;
        this.averageRating = averageRating;
        this.scores = scores;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public double getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(double averageRating) {
        this.averageRating = averageRating;
    }

    public int getScores() {
        return scores;
    }

    public void setScores(int scores) {
        this.scores = scores;
    }
}
