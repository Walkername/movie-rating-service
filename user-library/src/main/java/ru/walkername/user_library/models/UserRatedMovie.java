package ru.walkername.user_library.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Version;
import org.springframework.data.elasticsearch.annotations.DateFormat;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import java.time.Instant;

@NoArgsConstructor
@Getter
@Setter
@ToString
@Document(indexName = "#{@environment.getProperty('spring.elasticsearch.index.user-rated-movies')}")
public class UserRatedMovie {

    @Id
    private String id;

    @Version
    private Long version;

    private boolean deleted = false;

    private Long userId;

    private Long movieId;

    private int rating;

    @Field(type = FieldType.Date, format = DateFormat.date_time)
    private Instant ratedAt;

    // Movie Fields

    private String movieTitle;

    private int movieReleaseYear;

    private double movieAverageRating;

    private int movieScores;

    @Field(type = FieldType.Date, format = DateFormat.date_time)
    private Instant movieCreatedAt;

    public UserRatedMovie(
            String id,
            Long userId,
            Long movieId,
            int rating,
            Instant ratedAt,
            String movieTitle,
            int movieReleaseYear,
            double movieAverageRating,
            int movieScores,
            Instant movieCreatedAt
    ) {
        this.id = id;
        this.userId = userId;
        this.movieId = movieId;
        this.rating = rating;
        this.ratedAt = ratedAt;
        this.movieTitle = movieTitle;
        this.movieReleaseYear = movieReleaseYear;
        this.movieAverageRating = movieAverageRating;
        this.movieScores = movieScores;
        this.movieCreatedAt = movieCreatedAt;
    }

    public static String generateId(Long userId, Long movieId) {
        return userId + ":" + movieId;
    }
}
