package ru.walkername.user_profile.services;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import ru.walkername.user_profile.models.User;

import java.time.ZonedDateTime;
import java.util.Date;

@Service
public class TokenService {

    @Value("${auth.jwt.access}")
    private String accessToken;

    @Value("${auth.jwt.refresh}")
    private String refreshToken;

    public String generateAccessToken(User user) {
        Date expiresAt = Date.from(ZonedDateTime.now().plusMinutes(15).toInstant());

        return JWT.create()
                .withSubject("User details")
                .withClaim("id", user.getId())
                .withClaim("username", user.getUsername())
                .withClaim("role", user.getRole())
                .withIssuedAt(new Date())
                .withIssuer("auth-service")
                .withExpiresAt(expiresAt)
                .sign(Algorithm.HMAC256(accessToken));
    }

    public String generateRefreshToken(User user) {
        Date expiresAt = Date.from(ZonedDateTime.now().plusDays(30).toInstant());

        return JWT.create()
                .withSubject("User details")
                .withClaim("id", user.getId())
                .withClaim("username", user.getUsername())
                .withClaim("role", user.getRole())
                .withIssuedAt(new Date())
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
