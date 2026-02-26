package ru.walkername.user_profile.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.walkername.user_profile.dto.AuthRequest;
import ru.walkername.user_profile.dto.JWTResponse;
import ru.walkername.user_profile.dto.RefreshTokenRequest;
import ru.walkername.user_profile.mapper.UserMapper;
import ru.walkername.user_profile.models.User;
import ru.walkername.user_profile.services.AuthService;

@RequiredArgsConstructor
@RestController
@RequestMapping("/auth")
@CrossOrigin
public class AuthController {

    private final AuthService authService;
    private final UserMapper userMapper;

    @PostMapping("/register")
    public ResponseEntity<HttpStatus> register(
            @RequestBody @Valid AuthRequest authRequest
    ) {
        User user = userMapper.toUser(authRequest);

        authService.register(user);

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/login")
    public ResponseEntity<JWTResponse> login(
            @RequestBody @Valid AuthRequest authRequest
    ) {
        JWTResponse jwtResponse = authService.login(authRequest);

        return new ResponseEntity<>(jwtResponse, HttpStatus.OK);
    }

    @PostMapping("/refresh")
    public ResponseEntity<JWTResponse> refreshTokens(
            @RequestBody @Valid RefreshTokenRequest refreshTokenRequest
    ) {
        String refreshTokenContent = refreshTokenRequest.refreshToken();

        JWTResponse jwtResponse = authService.refreshTokens(refreshTokenContent);

        return new ResponseEntity<>(jwtResponse, HttpStatus.OK);
    }

}
