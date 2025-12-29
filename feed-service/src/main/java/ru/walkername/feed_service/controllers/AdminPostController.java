package ru.walkername.feed_service.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
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

@RestController
@RequestMapping("/admin/posts")
public class AdminPostController {

    private final AdminPostService adminPostService;
    private final PostModelMapper postModelMapper;

    @Autowired
    public AdminPostController(AdminPostService adminPostService, PostModelMapper postModelMapper) {
        this.adminPostService = adminPostService;
        this.postModelMapper = postModelMapper;
    }

    @PostMapping("")
    public ResponseEntity<PostResponse> save(
            @RequestBody PostRequest postRequest,
            BindingResult bindingResult
    ) {
        DTOValidator.validate(bindingResult, PostWrongValidationException::new);
        Post postToSave = postModelMapper.toPost(postRequest);
        PostResponse post = adminPostService.save(postToSave);
        return new ResponseEntity<>(post, HttpStatus.CREATED);
    }

}
