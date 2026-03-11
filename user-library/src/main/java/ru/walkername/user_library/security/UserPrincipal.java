package ru.walkername.user_library.security;

public record UserPrincipal(
        Long userId,
        String username,
        String role
) {

}
