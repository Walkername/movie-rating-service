package ru.walkername.feed_service.mapper;

import org.mapstruct.Mapper;
import ru.walkername.feed_service.dto.CommentRequest;
import ru.walkername.feed_service.dto.CommentResponse;
import ru.walkername.feed_service.models.Comment;

@Mapper(componentModel = "spring")
public interface CommentMapper {

    Comment toComment(CommentRequest commentRequest);

    CommentResponse toCommentResponse(Comment comment);

    CommentResponse toCommentResponse(Comment comment, String username);

}
