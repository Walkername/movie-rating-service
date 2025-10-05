package ru.walkername.user_profile.exceptions;

public class UserInvalidFields extends RuntimeException {
    public UserInvalidFields(String message) {
        super(message);
    }
}
