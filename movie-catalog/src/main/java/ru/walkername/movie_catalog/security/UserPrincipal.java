package ru.walkername.movie_catalog.security;

public record UserPrincipal(
        Long userId,
        String username,
        String role
) {

}
