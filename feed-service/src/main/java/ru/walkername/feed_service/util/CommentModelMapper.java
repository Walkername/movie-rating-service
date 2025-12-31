package ru.walkername.feed_service.util;

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;
import ru.walkername.feed_service.dto.CommentRequest;
import ru.walkername.feed_service.dto.CommentResponse;
import ru.walkername.feed_service.models.Comment;

@RequiredArgsConstructor
@Component
public class CommentModelMapper {

    private final ModelMapper modelMapper;

    public Comment toComment(CommentRequest commentRequest) {
        return modelMapper.map(commentRequest, Comment.class);
    }

    public CommentResponse toResponse(Comment comment) {
        return modelMapper.map(comment, CommentResponse.class);
    }

}
