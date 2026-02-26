package ru.walkername.user_profile.services;

import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.walkername.user_profile.dto.AuthRequest;
import ru.walkername.user_profile.dto.JWTResponse;
import ru.walkername.user_profile.exceptions.*;
import ru.walkername.user_profile.models.RefreshToken;
import ru.walkername.user_profile.models.User;
import ru.walkername.user_profile.models.UserRole;
import ru.walkername.user_profile.repositories.RefreshTokensRepository;
import ru.walkername.user_profile.repositories.UsersRepository;

import java.time.Instant;
import java.util.Optional;

@Slf4j
@RequiredArgsConstructor
@Service
@Transactional(readOnly = true)
public class AuthService {

    private final UsersRepository usersRepository;
    private final PasswordEncoder passwordEncoder;
    private final RefreshTokensRepository refreshTokensRepository;
    private final TokenService tokenService;

    @Transactional
    public void register(User user) {
        if (usersRepository.existsByUsername(user.getUsername())) {
            log.warn("Registration attempt for existing username: {}", user.getUsername());
            throw new UserExistsException("User with such username already exists");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole(UserRole.USER);
        user.setCreatedAt(Instant.now());
        user.setUpdatedAt(Instant.now());
        usersRepository.save(user);

        log.debug("User registered successfully: {}", user.getUsername());
    }

    @Transactional
    public JWTResponse login(AuthRequest request) {
        User dbUser = checkAndGet(request);

        JWTResponse jwtResponse = generateAndStoreTokens(dbUser);

        log.debug("User successfully authenticated: {}", dbUser.getUsername());

        return jwtResponse;
    }

    private User checkAndGet(AuthRequest request) {
        User dbUser = usersRepository.findByUsername(request.username())
                .orElseThrow(() -> {
                            log.warn("Login attempt with non-existing username: {}", request.username());
                            return new UserNotFoundException("Wrong credentials");
                        }
                );

        if (!passwordEncoder.matches(request.password(), dbUser.getPassword())) {
            log.warn("Invalid password attempt for username: {}", request.username());
            throw new InvalidCredentials("Wrong credentials");
        }

        return dbUser;
    }

    @Transactional
    public JWTResponse refreshTokens(String refreshTokenContent) {
        Long userId = validateRefreshToken(refreshTokenContent);

        User user = usersRepository.findById(userId).orElseThrow(
                () -> new UserNotFoundException("User not found")
        );

        return generateAndStoreTokens(user);
    }

    private Long validateRefreshToken(String rawRefreshToken) {
        try {
            DecodedJWT jwt = tokenService.validateRefreshToken(rawRefreshToken);
            Long userId = jwt.getClaim("userId").asLong();

            Optional<RefreshToken> refreshToken = findRefreshToken(userId);
            if (refreshToken.isEmpty()) {
                log.warn("Not such refresh token by userId: {}",  userId);
                throw new InvalidRefreshTokenException("Invalid refresh token");
            }

            RefreshToken existingRefreshToken = refreshToken.get();
            String existingRefreshTokenHash = existingRefreshToken.getTokenHash();
            if (!passwordEncoder.matches(rawRefreshToken, existingRefreshTokenHash)) {
                log.warn("Mismatch between the refresh token from the database and the request by userId: {}",  userId);
                throw new InvalidRefreshTokenException("Invalid refresh token");
            }

            return userId;
        } catch (JWTVerificationException e) {
            throw new InvalidRefreshTokenException("Invalid refresh token");
        }
    }

    private JWTResponse generateAndStoreTokens(User user) {
        String rawAccessToken = tokenService.generateAccessToken(user);
        String rawRefreshToken = tokenService.generateRefreshToken(user);

        updateRefreshToken(user.getId(), rawRefreshToken);

        return new JWTResponse(rawAccessToken, rawRefreshToken);
    }

    private void updateRefreshToken(Long userId, String rawRefreshToken) {
        Optional<RefreshToken> dbRefreshToken = refreshTokensRepository.findByUserId(userId);
        String refreshTokenHash = passwordEncoder.encode(rawRefreshToken);

        if (dbRefreshToken.isPresent()) {
            RefreshToken existingRefreshToken = dbRefreshToken.get();
            existingRefreshToken.setTokenHash(refreshTokenHash);
        } else {
            RefreshToken newRefreshToken = new RefreshToken(userId, refreshTokenHash);
            refreshTokensRepository.save(newRefreshToken);
        }
    }

    private Optional<RefreshToken> findRefreshToken(Long userId) {
        return refreshTokensRepository.findByUserId(userId);
    }

}
