package ru.walkername.movie_catalog.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.time.Instant;

@NoArgsConstructor
@Getter
@Setter
@ToString
@Entity
@Table(name = "movie")
public class Movie {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotEmpty(message = "Movie title should not be empty")
    @Size(min = 1, max = 50, message = "Movie title should be greater than 1 and less than 50 characters")
    @Column(name = "title")
    private String title;

    @Min(value = 0, message = "Release year cannot be negative")
    @Column(name = "release_year")
    private int releaseYear;

    @Size(max = 500, message = "Description should be less than 500 characters")
    @Column(name = "description")
    private String description;

    @Column(name = "average_rating")
    private double averageRating;

    @Column(name = "scores")
    private int scores;

    @Column(name = "poster_pic_id")
    private Long posterPicId;

    @Column(name = "created_at")
    private Instant createdAt;
}
