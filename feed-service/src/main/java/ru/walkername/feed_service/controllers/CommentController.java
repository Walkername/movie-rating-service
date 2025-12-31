package ru.walkername.feed_service.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import ru.walkername.feed_service.dto.CommentRequest;
import ru.walkername.feed_service.dto.CommentResponse;
import ru.walkername.feed_service.dto.PageResponse;
import ru.walkername.feed_service.exceptions.CommentWrongValidationException;
import ru.walkername.feed_service.models.Comment;
import ru.walkername.feed_service.security.UserPrincipal;
import ru.walkername.feed_service.services.CommentService;
import ru.walkername.feed_service.util.CommentModelMapper;
import ru.walkername.feed_service.util.DTOValidator;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/posts/{postId}/comments")
public class CommentController {

    private final CommentService commentService;
    private final CommentModelMapper commentModelMapper;

    @PostMapping("")
    public ResponseEntity<CommentResponse> save(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable("postId") Long postId,
            @RequestBody CommentRequest commentRequest,
            BindingResult bindingResult
    ) {
        DTOValidator.validate(bindingResult, CommentWrongValidationException::new);

        Comment commentToSave = commentModelMapper.toComment(commentRequest);

        Long userId = userPrincipal.getUserId();
        Comment comment = commentService.save(postId, userId, commentToSave);

        CommentResponse commentResponse = commentModelMapper.toResponse(comment);
        commentResponse.setPostId(postId);

        return new ResponseEntity<>(commentResponse, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<PageResponse<CommentResponse>> getAllForPost(
            @RequestParam(value = "page", defaultValue = "0") Integer page,
            @RequestParam(value = "limit", defaultValue = "5") Integer limit,
            @PathVariable("postId") Long postId
    ) {
        PageResponse<CommentResponse> pageResponse = commentService.findAllByPostId(postId, page, limit);
        return new ResponseEntity<>(pageResponse, HttpStatus.OK);
    }

}
