package ru.walkername.movie_catalog.util;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import ru.walkername.movie_catalog.dto.MovieRequest;
import ru.walkername.movie_catalog.dto.MovieResponse;
import ru.walkername.movie_catalog.models.Movie;

@Component
public class MovieModelMapper {

    private final ModelMapper modelMapper;

    @Autowired
    public MovieModelMapper(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
    }

    public Movie convertToMovie(MovieRequest movieRequest) {
        return modelMapper.map(movieRequest, Movie.class);
    }

    public void convertToMovie(MovieRequest movieRequest, Movie movieToUpdate) {
        modelMapper.map(movieRequest, movieToUpdate);
    }

    public MovieResponse convertToMovieResponse(Movie movie) {
        return modelMapper.map(movie, MovieResponse.class);
    }

}
