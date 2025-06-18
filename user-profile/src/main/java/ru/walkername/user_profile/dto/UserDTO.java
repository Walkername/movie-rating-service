package ru.walkername.user_profile.dto;

import jakarta.validation.constraints.Size;

public class UserDTO {

    @Size(max = 500, message = "Description should not be greater than 500 characters")
    private String description;

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
