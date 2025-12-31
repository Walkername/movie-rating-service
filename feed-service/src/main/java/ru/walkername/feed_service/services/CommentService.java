package ru.walkername.feed_service.services;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import ru.walkername.feed_service.dto.CommentResponse;
import ru.walkername.feed_service.dto.PageResponse;
import ru.walkername.feed_service.dto.UserResponse;
import ru.walkername.feed_service.models.Comment;
import ru.walkername.feed_service.models.Post;
import ru.walkername.feed_service.repositories.CommentRepository;
import ru.walkername.feed_service.util.CommentModelMapper;

import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
@Transactional(readOnly = true)
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostService postService;
    private final RestTemplate restTemplate;
    private final CommentModelMapper commentModelMapper;

    @Value("${user-profile-service.url}")
    private String USER_PROFILE_SERVICE_URL;

    @Transactional
    public Comment save(Long postId, Long userId, Comment comment) {
        Post post = postService.findOne(postId);
        comment.setPost(post);
        comment.setUserId(userId);
        comment.setPublishedAt(Instant.now());
        return commentRepository.save(comment);
    }

    public PageResponse<CommentResponse> findAllByPostId(Long postId, int page, int limit) {
        Pageable pageable = PageRequest.of(page, limit);
        Page<Comment> commentPage = commentRepository.findAllByPostId(postId, pageable);

        Set<Long> userIds = commentPage.getContent().stream().map(Comment::getUserId).collect(Collectors.toSet());

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<List<Long>> requestEntity = new HttpEntity<>(new ArrayList<>(userIds), headers);

        String url = USER_PROFILE_SERVICE_URL + "/users/batch?page=" + page + "&limit=" + limit;

        ResponseEntity<PageResponse<UserResponse>> response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                requestEntity,
                new ParameterizedTypeReference<>() {}
        );

        List<CommentResponse> commentResponses = new ArrayList<>();
        Map<Long, UserResponse> userMap = new HashMap<>();
        if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
            List<UserResponse> users = response.getBody().getContent();
            userMap = users.stream()
                    .collect(Collectors.toMap(UserResponse::getId, Function.identity()));
        }

        for (Comment comment : commentPage.getContent()) {
            CommentResponse commentResponse = commentModelMapper.toResponse(comment);

            String username = userMap.get(comment.getUserId()).getUsername();
            commentResponse.setUsername(username);

            commentResponses.add(commentResponse);
        }

        return new PageResponse<>(
                commentResponses,
                page,
                limit,
                commentPage.getTotalElements(),
                commentPage.getTotalPages()
        );
    }

}
