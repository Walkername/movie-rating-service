package ru.walkername.feed_service.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CommentResponse {

    private Long id;

    private Long postId;

    private Long userId;

    private String username;

    private String content;

    private Instant publishedAt;

}
