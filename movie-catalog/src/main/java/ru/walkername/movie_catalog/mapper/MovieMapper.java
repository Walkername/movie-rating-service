package ru.walkername.movie_catalog.mapper;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import ru.walkername.movie_catalog.dto.MovieRequest;
import ru.walkername.movie_catalog.dto.MovieResponse;
import ru.walkername.movie_catalog.models.Movie;
import ru.walkername.movie_catalog.models.MovieDocument;

@Mapper(componentModel = "spring")
public interface MovieMapper {

    Movie toMovie(MovieRequest movieRequest);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void toMovie(Movie source, @MappingTarget Movie destination);

    @Mapping(target = "posterPicUrl", source = "posterPicUrl")
    MovieResponse toMovieResponse(Movie movie, String posterPicUrl);

    MovieResponse toMovieResponse(Movie movie);

    MovieResponse toMovieResponse(MovieDocument movieDocument);

    MovieDocument toMovieDocument(Movie movie);

}
