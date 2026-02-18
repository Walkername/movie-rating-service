package ru.walkername.user_profile.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

public record AuthRequest(
        @NotEmpty(message = "Nickname should not be empty")
        @Size(min = 5, max = 20, message = "Nickname should be greater than 5 and less than 20 characters")
        String username,

        @NotEmpty(message = "Password cannot be empty")
        @Size(min = 5, message = "Password should be greater than 5 characters")
        String password
) {

}