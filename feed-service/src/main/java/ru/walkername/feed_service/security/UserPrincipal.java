package ru.walkername.feed_service.security;

public record UserPrincipal(
        Long userId,
        String username,
        String role
) {

}
