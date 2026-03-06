package ru.walkername.rating_system.security;

public record UserPrincipal(
        Long userId,
        String username,
        String role
) {

}
