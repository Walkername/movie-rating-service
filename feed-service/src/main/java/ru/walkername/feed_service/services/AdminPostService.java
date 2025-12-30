package ru.walkername.feed_service.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.walkername.feed_service.exceptions.PostNotFoundException;
import ru.walkername.feed_service.models.Post;
import ru.walkername.feed_service.repositories.PostRepository;

import java.time.Instant;

@RequiredArgsConstructor
@Service
@Transactional(readOnly = true)
public class AdminPostService {

    private final PostRepository postRepository;

    @Transactional
    public Post save(Post post) {
        post.setPublishedAt(Instant.now());
        return postRepository.save(post);
    }

    @Transactional
    public Post update(Long id, Post post) {
        Post dbPost = postRepository.findById(id).orElseThrow(
                () -> new PostNotFoundException("Post not found")
        );

        post.setId(id);
        post.setPublishedAt(dbPost.getPublishedAt());

        return postRepository.save(post);
    }

    @Transactional
    public void delete(Long id) {
        boolean postsExists = postRepository.existsById(id);
        if (!postsExists) {
            throw new PostNotFoundException("Post not found");
        }

        postRepository.deleteById(id);
    }

}
