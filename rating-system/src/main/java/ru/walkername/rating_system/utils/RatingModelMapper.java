package ru.walkername.rating_system.utils;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import ru.walkername.rating_system.dto.RatingRequest;
import ru.walkername.rating_system.dto.RatingResponse;
import ru.walkername.rating_system.models.Rating;

@Component
public class RatingModelMapper {

    private final ModelMapper modelMapper;

    @Autowired
    public RatingModelMapper(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
    }

    public Rating convertToRating(RatingRequest ratingRequest) {
        return modelMapper.map(ratingRequest, Rating.class);
    }

    public RatingResponse convertToRatingResponse(Rating rating) {
        return modelMapper.map(rating, RatingResponse.class);
    }

}
