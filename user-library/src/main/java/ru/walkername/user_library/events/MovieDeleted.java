package ru.walkername.user_library.events;

public class MovieDeleted {

    private Long movieId;

    public MovieDeleted() {
    }

    public MovieDeleted(Long movieId) {
        this.movieId = movieId;
    }

    public Long getMovieId() {
        return movieId;
    }

    public void setMovieId(Long movieId) {
        this.movieId = movieId;
    }

}
