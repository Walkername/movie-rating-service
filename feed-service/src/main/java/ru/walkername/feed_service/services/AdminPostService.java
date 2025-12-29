package ru.walkername.feed_service.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.walkername.feed_service.dto.PostResponse;
import ru.walkername.feed_service.models.Post;
import ru.walkername.feed_service.repositories.PostRepository;
import ru.walkername.feed_service.util.PostModelMapper;

import java.time.Instant;

@Service
@Transactional(readOnly = true)
public class AdminPostService {

    private final PostRepository postRepository;
    private final PostModelMapper postModelMapper;

    @Autowired
    public AdminPostService(PostRepository postRepository, PostModelMapper postModelMapper) {
        this.postRepository = postRepository;
        this.postModelMapper = postModelMapper;
    }

    @Transactional
    public PostResponse save(Post post) {
        post.setPublishedAt(Instant.now());
        return postModelMapper.toResponse(postRepository.save(post));
    }

}
