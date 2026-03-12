package ru.walkername.feed_service.services;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.walkername.feed_service.dto.PageResponse;
import ru.walkername.feed_service.dto.PostResponse;
import ru.walkername.feed_service.exceptions.PostNotFoundException;
import ru.walkername.feed_service.mapper.PostMapper;
import ru.walkername.feed_service.models.Post;
import ru.walkername.feed_service.repositories.PostRepository;

import java.util.List;

@RequiredArgsConstructor
@Service
@Transactional(readOnly = true)
public class PostService {

    private final PostRepository postRepository;
    private final PostMapper postMapper;

    public Post findOne(Long id) {
        return postRepository.findById(id).orElseThrow(
                () -> new PostNotFoundException("Post not found")
        );
    }

    public PageResponse<PostResponse> getPostsWithPagination(int page, int limit) {
        Sort sorting = Sort.by(Sort.Direction.DESC, "publishedAt");
        Pageable pageable = PageRequest.of(page, limit, sorting);
        Page<Post> postsPage = postRepository.findAll(pageable);

        List<PostResponse> postResponses = postsPage.getContent().stream()
                .map(postMapper::toPostResponse)
                .toList();

        return new PageResponse<>(
                postResponses,
                page,
                limit,
                postsPage.getTotalElements(),
                postsPage.getTotalPages()
        );
    }

}
