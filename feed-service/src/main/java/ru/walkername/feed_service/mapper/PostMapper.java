package ru.walkername.feed_service.mapper;

import org.mapstruct.Mapper;
import ru.walkername.feed_service.dto.PostRequest;
import ru.walkername.feed_service.dto.PostResponse;
import ru.walkername.feed_service.models.Post;

@Mapper(componentModel = "spring")
public interface PostMapper {

    Post toPost(PostRequest postRequest);

    PostResponse toPostResponse(Post post);

}
