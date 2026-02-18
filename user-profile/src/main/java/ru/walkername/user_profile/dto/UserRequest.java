package ru.walkername.user_profile.dto;

import jakarta.validation.constraints.Size;

public record UserRequest(
        @Size(max = 500, message = "Description should not be greater than 500 characters")
        String description
) {

}
