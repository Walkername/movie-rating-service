package ru.walkername.movie_catalog.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import ru.walkername.movie_catalog.dto.MovieRequest;
import ru.walkername.movie_catalog.dto.MovieResponse;
import ru.walkername.movie_catalog.models.Movie;

@Mapper(componentModel = "spring")
public interface MovieMapper {

    Movie toMovie(MovieRequest movieRequest);

    void toMovie(Movie source, @MappingTarget Movie destination);

    @Mapping(target = "posterPicUrl", source = "posterPicUrl")
    MovieResponse toMovieResponse(Movie movie, String posterPicUrl);

    MovieResponse toMovieResponse(Movie movie);

}
