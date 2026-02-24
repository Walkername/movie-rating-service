package ru.walkername.movie_catalog.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

public record MovieRequest(
        @NotEmpty(message = "Movie title should not be empty")
        @Size(min = 1, max = 50, message = "Movie title should be greater than 1 and less than 50 characters")
        String title,

        @Min(value = 0, message = "Release year cannot be negative")
        int releaseYear,

        @Size(max = 500, message = "Description should be less than 500 characters")
        String description
) {

}
