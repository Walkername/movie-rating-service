package ru.walkername.user_profile.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

public class AuthDTO {

    @NotEmpty(message = "Nickname should not be empty")
    @Size(min = 5, max = 20, message = "Nickname should be greater than 5 and less than 20 characters")
    private String username;

    @NotEmpty(message = "Password cannot be empty")
    @Size(min = 5, message = "Password should be greater than 5 characters")
    private String password;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
