package ru.walkername.user_profile.controllers;

import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;
import ru.walkername.user_profile.dto.AuthDTO;
import ru.walkername.user_profile.models.User;
import ru.walkername.user_profile.services.AuthService;
import ru.walkername.user_profile.services.TokenService;
import ru.walkername.user_profile.util.RegistrationException;
import ru.walkername.user_profile.util.UserErrorResponse;
import ru.walkername.user_profile.util.UserValidator;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin
public class AuthController {

    private final AuthService authService;
    private final ModelMapper modelMapper;
    private final UserValidator userValidator;
    private final TokenService tokenService;

    @Autowired
    public AuthController(
            AuthService authService,
            ModelMapper modelMapper,
            UserValidator userValidator, TokenService tokenService) {
        this.authService = authService;
        this.modelMapper = modelMapper;
        this.userValidator = userValidator;
        this.tokenService = tokenService;
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
    public Map<String, String> login(
            @RequestBody @Valid AuthDTO authDTO,
            BindingResult bindingResult
    ) {
        User user = convertToUser(authDTO);
        //userValidator.validate(user, bindingResult);
        validateUser(bindingResult);

        authService.check(user);
        String token = tokenService.generateToken(user.getUsername());
        return Map.of("token", token);
    }

    @ExceptionHandler
    private ResponseEntity<UserErrorResponse> handleException(RegistrationException ex) {
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
