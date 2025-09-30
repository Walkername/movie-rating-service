package ru.walkername.user_profile.exception;

public class UserInvalidFields extends RuntimeException {
    public UserInvalidFields(String message) {
        super(message);
    }
}
