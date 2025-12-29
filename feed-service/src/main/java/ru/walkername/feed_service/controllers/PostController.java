package ru.walkername.feed_service.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import ru.walkername.feed_service.dto.PageResponse;
import ru.walkername.feed_service.dto.PostResponse;
import ru.walkername.feed_service.services.PostService;

@RestController
@RequestMapping("/posts")
public class PostController {

    private final PostService postService;

    @Autowired
    public PostController(PostService postService) {
        this.postService = postService;
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
