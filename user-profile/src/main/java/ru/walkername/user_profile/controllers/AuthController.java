package ru.walkername.user_profile.controllers;

import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import ru.walkername.user_profile.dto.AuthDTO;
import ru.walkername.user_profile.dto.JWTResponse;
import ru.walkername.user_profile.dto.RefreshTokenRequest;
import ru.walkername.user_profile.exceptions.InvalidRefreshTokenException;
import ru.walkername.user_profile.exceptions.LoginException;
import ru.walkername.user_profile.exceptions.RegistrationException;
import ru.walkername.user_profile.models.RefreshToken;
import ru.walkername.user_profile.models.User;
import ru.walkername.user_profile.services.AuthService;
import ru.walkername.user_profile.services.TokenService;
import ru.walkername.user_profile.services.UsersService;
import ru.walkername.user_profile.util.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin
public class AuthController {

    private final AuthService authService;
    private final UserModelMapper userModelMapper;
    private final UserValidator userValidator;
    private final TokenService tokenService;
    private final UsersService usersService;

    @Autowired
    public AuthController(
            AuthService authService,
            UserModelMapper userModelMapper,
            UserValidator userValidator,
            TokenService tokenService,
            UsersService usersService) {
        this.authService = authService;
        this.userModelMapper = userModelMapper;
        this.userValidator = userValidator;
        this.tokenService = tokenService;
        this.usersService = usersService;
    }

    @PostMapping("/register")
    public ResponseEntity<HttpStatus> register(
            @RequestBody @Valid AuthDTO authDTO,
            BindingResult bindingResult
    ) {
        User user = userModelMapper.convertToUser(authDTO);
        userValidator.validate(user, bindingResult);
        DTOValidator.validate(bindingResult, RegistrationException::new);

        authService.register(user);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/login")
    public ResponseEntity<JWTResponse> login(
            @RequestBody @Valid AuthDTO authDTO,
            BindingResult bindingResult
    ) {
        User user = userModelMapper.convertToUser(authDTO);
        DTOValidator.validate(bindingResult, LoginException::new);

        // If such a person exists in DB
        User userDB = authService.checkAndGet(user);

        // Generating tokens
        String accessToken = tokenService.generateAccessToken(userDB);
        String refreshToken = tokenService.generateRefreshToken(userDB);

        // Update refresh token
        authService.updateRefreshToken(userDB.getId(), refreshToken);
        JWTResponse jwtResponse = new JWTResponse(accessToken, refreshToken);

        return new ResponseEntity<>(jwtResponse, HttpStatus.OK);
    }

    @PostMapping("/refresh")
    public ResponseEntity<JWTResponse> refreshTokens(
            @RequestBody @Valid RefreshTokenRequest refreshTokenRequest
    ) {
        Long userId;

        try {
            // Checking if refresh token is valid
            DecodedJWT jwt = tokenService.validateRefreshToken(refreshTokenRequest.getRefreshToken());
            userId = jwt.getClaim("id").asLong();

            // Getting current user's refresh token in order to compare
            RefreshToken refreshToken = authService.findRefreshToken(userId);
            if (refreshToken == null || !refreshToken.getRefreshToken().equals(refreshTokenRequest.getRefreshToken())) {
                throw new InvalidRefreshTokenException("Invalid refresh token");
            }
        } catch (JWTVerificationException e) {
            // If jwt refresh token is invalid, then return nothing
            throw new InvalidRefreshTokenException("Invalid refresh token");
        }

        // Getting person by id in order to generate tokens
        User user = usersService.findOne(userId);

        // Generating a pair of tokens
        String accessToken = tokenService.generateAccessToken(user);
        String refreshToken = tokenService.generateRefreshToken(user);

        // Update current refresh token on new refresh token
        authService.updateRefreshToken(userId, refreshToken);
        JWTResponse jwtResponse = new JWTResponse(accessToken, refreshToken);
        return new ResponseEntity<>(jwtResponse, HttpStatus.OK);
    }

}
