package ru.walkername.movie_catalog.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
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
@Document(indexName = "#{@environment.getProperty('spring.elasticsearch.index.movies')}")
public class MovieDocument {

    @Id
    private String id;

    @Version
    private Long version;

    private String title;

    private int releaseYear;

    private String description;

    private double averageRating;

    private int scores;

    private Long posterPicId;

    @Field(type = FieldType.Date, format = DateFormat.date_time)
    private Instant createdAt;

}
