package ru.walkername.feed_service.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.walkername.feed_service.dto.PostRequest;
import ru.walkername.feed_service.dto.PostResponse;
import ru.walkername.feed_service.exceptions.PostWrongValidationException;
import ru.walkername.feed_service.models.Post;
import ru.walkername.feed_service.services.AdminPostService;
import ru.walkername.feed_service.util.DTOValidator;
import ru.walkername.feed_service.util.PostModelMapper;

@RequiredArgsConstructor
@RestController
@RequestMapping("/admin/posts")
public class AdminPostController {

    private final AdminPostService adminPostService;
    private final PostModelMapper postModelMapper;

    @PostMapping("")
    public ResponseEntity<PostResponse> save(
            @RequestBody PostRequest postRequest,
            BindingResult bindingResult
    ) {
        DTOValidator.validate(bindingResult, PostWrongValidationException::new);

        Post postToSave = postModelMapper.toPost(postRequest);

        Post post = adminPostService.save(postToSave);

        PostResponse postResponse = postModelMapper.toResponse(post);

        return new ResponseEntity<>(postResponse, HttpStatus.CREATED);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<PostResponse> update(
            @PathVariable Long id,
            @RequestBody PostRequest postRequest,
            BindingResult bindingResult
    ) {
        DTOValidator.validate(bindingResult, PostWrongValidationException::new);

        Post newData = postModelMapper.toPost(postRequest);

        Post post = adminPostService.update(id, newData);

        PostResponse postResponse = postModelMapper.toResponse(post);

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
