package ru.walkername.user_profile.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

public class UsernameDTO {

    @NotEmpty(message = "Nickname should not be empty")
    @Size(min = 5, max = 20, message = "Nickname should be greater than 5 and less than 20 characters")
    private String username;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

}
