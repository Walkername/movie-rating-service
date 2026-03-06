package ru.walkername.rating_system.mapper;

import org.mapstruct.Mapper;
import ru.walkername.rating_system.dto.RatingRequest;
import ru.walkername.rating_system.dto.RatingResponse;
import ru.walkername.rating_system.models.Rating;

@Mapper(componentModel = "spring")
public interface RatingMapper {

    Rating toRating(RatingRequest ratingRequest);

    RatingResponse toRatingResponse(Rating rating);

}
