package ru.walkername.user_profile.services;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import ru.walkername.user_profile.models.User;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Service
public class TokenService {

    @Value("${auth.jwt.access}")
    private String accessToken;

    @Value("${auth.jwt.refresh}")
    private String refreshToken;

    public String generateAccessToken(User user) {
        Instant expiresAt = Instant.now().plus(15, ChronoUnit.MINUTES);

        return JWT.create()
                .withSubject("User details")
                .withClaim("id", user.getId())
                .withClaim("username", user.getUsername())
                .withClaim("role", user.getRole().toString())
                .withIssuedAt(Instant.now())
                .withIssuer("auth-service")
                .withExpiresAt(expiresAt)
                .sign(Algorithm.HMAC256(accessToken));
    }

    public String generateRefreshToken(User user) {
        Instant expiresAt = Instant.now().plus(30, ChronoUnit.DAYS);

        return JWT.create()
                .withSubject("User details")
                .withClaim("id", user.getId())
                .withClaim("username", user.getUsername())
                .withClaim("role", user.getRole().toString())
                .withIssuedAt(Instant.now())
                .withIssuer("auth-service")
                .withExpiresAt(expiresAt)
                .sign(Algorithm.HMAC256(refreshToken));
    }

    public DecodedJWT validateAccessToken(String token) {
        return validateToken(token, accessToken);
    }

    public DecodedJWT validateRefreshToken(String token) {
        return validateToken(token, refreshToken);
    }

    public DecodedJWT validateToken(String token, String secret) throws JWTVerificationException {
        JWTVerifier verifier = JWT.require(Algorithm.HMAC256(secret))
                .withSubject("User details")
                .withIssuer("auth-service")
                .build();

        return verifier.verify(token);
    }

}
