package ru.walkername.user_profile.security;

public record UserPrincipal(
        Long userId,
        String username,
        String role
) {

}
