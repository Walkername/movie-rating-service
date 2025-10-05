package ru.walkername.user_profile.exceptions;

public class UserInvalidUsername extends RuntimeException {
    public UserInvalidUsername(String message) {
        super(message);
    }
}
