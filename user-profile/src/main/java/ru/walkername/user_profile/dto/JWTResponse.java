package ru.walkername.user_profile.dto;

public record JWTResponse(
        String accessToken,
        String refreshToken
) {

}