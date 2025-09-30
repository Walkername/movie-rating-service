package ru.walkername.user_profile.exception;

public class UserInvalidUsername extends RuntimeException {
    public UserInvalidUsername(String message) {
        super(message);
    }
}
