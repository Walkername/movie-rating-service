package ru.walkername.feed_service.util;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import ru.walkername.feed_service.dto.PostResponse;
import ru.walkername.feed_service.models.Post;

@Component
public class PostModelMapper {

    private final ModelMapper modelMapper;

    @Autowired
    public PostModelMapper(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
    }

    public PostResponse toResponse(Post post) {
        return modelMapper.map(post, PostResponse.class);
    }

}
