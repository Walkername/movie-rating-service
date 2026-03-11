package ru.walkername.user_library.mapper;

import org.mapstruct.Mapper;
import ru.walkername.user_library.dto.UserRatedMovieResponse;
import ru.walkername.user_library.models.UserRatedMovie;

@Mapper(componentModel = "spring")
public interface UserRatingMapper {

    UserRatedMovieResponse toUserRatedMovieResponse(UserRatedMovie userRatedMovie);

}
