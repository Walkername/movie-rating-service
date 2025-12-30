package ru.walkername.feed_service.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import ru.walkername.feed_service.dto.PageResponse;
import ru.walkername.feed_service.dto.PostResponse;
import ru.walkername.feed_service.models.Post;
import ru.walkername.feed_service.services.PostService;
import ru.walkername.feed_service.util.PostModelMapper;

@RequiredArgsConstructor
@RestController
@RequestMapping("/posts")
public class PostController {

    private final PostService postService;
    private final PostModelMapper postModelMapper;

    @GetMapping("/{id}")
    public ResponseEntity<PostResponse> get(
            @PathVariable Long id
    ) {
        Post post = postService.findOne(id);
        PostResponse postResponse = postModelMapper.toResponse(post);
        return new ResponseEntity<>(postResponse, HttpStatus.OK);
    }

    @GetMapping("")
    public ResponseEntity<PageResponse<PostResponse>> index(
            @RequestParam(value = "page", defaultValue = "10") Integer page,
            @RequestParam(value = "limit", defaultValue = "10") Integer limit
    ) {
        PageResponse<PostResponse> pageResponse = postService.getPostsWithPagination(page, limit);
        return new ResponseEntity<>(pageResponse, HttpStatus.OK);
    }

}
