package ru.walkername.feed_service.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class UserResponse {

    private Long id;

    private String username;

    private String description;

    private Integer profilePicId;

    private double averageRating;

    private int scores;
}
