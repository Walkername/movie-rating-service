package ru.walkername.user_profile.controllers;

import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;
import ru.walkername.user_profile.dto.AuthDTO;
import ru.walkername.user_profile.dto.JWTResponse;
import ru.walkername.user_profile.dto.RefreshTokenRequest;
import ru.walkername.user_profile.models.RefreshToken;
import ru.walkername.user_profile.models.User;
import ru.walkername.user_profile.services.AuthService;
import ru.walkername.user_profile.services.TokenService;
import ru.walkername.user_profile.services.UsersService;
import ru.walkername.user_profile.util.*;

import java.util.List;

@RestController
@RequestMapping("/auth")
@CrossOrigin
public class AuthController {

    private final AuthService authService;
    private final ModelMapper modelMapper;
    private final UserValidator userValidator;
    private final TokenService tokenService;
    private final UsersService usersService;

    @Autowired
    public AuthController(
            AuthService authService,
            ModelMapper modelMapper,
            UserValidator userValidator,
            TokenService tokenService,
            UsersService usersService) {
        this.authService = authService;
        this.modelMapper = modelMapper;
        this.userValidator = userValidator;
        this.tokenService = tokenService;
        this.usersService = usersService;
    }

    @PostMapping("/register")
    public ResponseEntity<HttpStatus> register(
            @RequestBody @Valid AuthDTO authDTO,
            BindingResult bindingResult
    ) {
        User user = convertToUser(authDTO);
        userValidator.validate(user, bindingResult);
        validateUser(bindingResult);

        authService.register(user);
        //String token = tokenService.generateToken(user.getUsername());
        return ResponseEntity.ok(HttpStatus.OK);
    }

    @PostMapping("/login")
    public JWTResponse login(
            @RequestBody @Valid AuthDTO authDTO,
            BindingResult bindingResult
    ) {
        User user = convertToUser(authDTO);
        validateUser(bindingResult);

        // If such a person exists in DB
        User userDB = authService.checkAndGet(user);

        // Generating tokens
        String accessToken = tokenService.generateAccessToken(userDB);
        String refreshToken = tokenService.generateRefreshToken(userDB);

        // Update refresh token
        authService.updateRefreshToken(userDB.getId(), refreshToken);

        return new JWTResponse(accessToken, refreshToken);
    }

    @PostMapping("/refresh")
    public JWTResponse refreshTokens(
            @RequestBody @Valid RefreshTokenRequest refreshTokenRequest
    ) {
        int userId;

        try {
            // Checking if refresh token is valid
            DecodedJWT jwt = tokenService.validateRefreshToken(refreshTokenRequest.getRefreshToken());
            userId = jwt.getClaim("id").asInt();

            // Getting current user's refresh token in order to compare
            RefreshToken refreshToken = authService.findRefreshToken(userId);
            if (refreshToken == null || !refreshToken.getRefreshToken().equals(refreshTokenRequest.getRefreshToken())) {
                throw new RefreshException("Invalid refresh token");
            }
        } catch (JWTVerificationException e) {
            // If jwt refresh token is invalid, then return nothing
            throw new RefreshException("Invalid refresh token");
        }

        // Getting person by id in order to generate tokens
        User user = usersService.findOne(userId);

        // Generating a pair of tokens
        String accessToken = tokenService.generateAccessToken(user);
        String refreshToken = tokenService.generateRefreshToken(user);

        // Update current refresh token on new refresh token
        authService.updateRefreshToken(userId, refreshToken);

        return new JWTResponse(accessToken, refreshToken);
    }

    @ExceptionHandler
    private ResponseEntity<UserErrorResponse> handleException(RefreshException ex) {
        UserErrorResponse response = new UserErrorResponse(
                ex.getMessage(),
                System.currentTimeMillis()
        );

        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler
    private ResponseEntity<UserErrorResponse> handleException(RegistrationException ex) {
        UserErrorResponse response = new UserErrorResponse(
                ex.getMessage(),
                System.currentTimeMillis()
        );

        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler
    private ResponseEntity<UserErrorResponse> handleException(LoginException ex) {
        UserErrorResponse response = new UserErrorResponse(
                ex.getMessage(),
                System.currentTimeMillis()
        );

        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    public void validateUser(BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            StringBuilder errorMsg = new StringBuilder();
            List<FieldError> errors = bindingResult.getFieldErrors();
            for (FieldError error : errors) {
                errorMsg.append(error.getField())
                        .append(" - ")
                        .append(error.getDefaultMessage())
                        .append(";");
            }

            throw new RegistrationException(errorMsg.toString());
        }
    }

    private User convertToUser(AuthDTO authDTO) {
        return modelMapper.map(authDTO, User.class);
    }

}
