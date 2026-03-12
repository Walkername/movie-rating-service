package ru.walkername.feed_service.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.walkername.feed_service.dto.PostRequest;
import ru.walkername.feed_service.dto.PostResponse;
import ru.walkername.feed_service.mapper.PostMapper;
import ru.walkername.feed_service.models.Post;
import ru.walkername.feed_service.services.AdminPostService;

@RequiredArgsConstructor
@RestController
@RequestMapping("/admin/posts")
public class AdminPostController {

    private final AdminPostService adminPostService;
    private final PostMapper postMapper;

    @PostMapping("")
    public ResponseEntity<PostResponse> save(
            @RequestBody PostRequest postRequest
    ) {

        Post postToSave = postMapper.toPost(postRequest);

        Post post = adminPostService.save(postToSave);

        PostResponse postResponse = postMapper.toPostResponse(post);

        return new ResponseEntity<>(postResponse, HttpStatus.CREATED);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<PostResponse> update(
            @PathVariable Long id,
            @RequestBody PostRequest postRequest
    ) {

        Post newData = postMapper.toPost(postRequest);

        Post post = adminPostService.update(id, newData);

        PostResponse postResponse = postMapper.toPostResponse(post);

        return new ResponseEntity<>(postResponse, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> delete(
            @PathVariable Long id
    ) {
        adminPostService.delete(id);
        return ResponseEntity.noContent().build();
    }

}
