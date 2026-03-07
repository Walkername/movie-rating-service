package ru.walkername.user_profile.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import ru.walkername.user_profile.dto.ErrorResponse;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler
    public ResponseEntity<ErrorResponse> handleException(MethodArgumentNotValidException ex) {
        String errorMessage = ex.getBindingResult().getFieldErrors().stream()
                .map(error -> error.getField() + " - " + error.getDefaultMessage())
                .reduce((msg1, msg2) -> msg1 + "; " + msg2)
                .orElse("Validation error");
        ErrorResponse response = new ErrorResponse(
                errorMessage,
                System.currentTimeMillis()
        );
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler
    private ResponseEntity<ErrorResponse> handleException(InvalidRefreshTokenException ex) {
        ErrorResponse response = new ErrorResponse(
                ex.getMessage(),
                System.currentTimeMillis()
        );

        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler
    private ResponseEntity<ErrorResponse> handleException(InvalidCredentials ex) {
        ErrorResponse response = new ErrorResponse(
                ex.getMessage(),
                System.currentTimeMillis()
        );

        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler
    private ResponseEntity<ErrorResponse> handleException(UserNotCreatedException ex) {
        ErrorResponse response = new ErrorResponse(
                ex.getMessage(),
                System.currentTimeMillis()
        );

        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler
    private ResponseEntity<ErrorResponse> handleException(UserWrongAverageRatingException ex) {
        ErrorResponse response = new ErrorResponse(
                ex.getMessage(),
                System.currentTimeMillis()
        );

        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler
    private ResponseEntity<ErrorResponse> handleException(UserNotFoundException ex) {
        ErrorResponse response = new ErrorResponse(
                ex.getMessage(),
                System.currentTimeMillis()
        );

        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler
    private ResponseEntity<ErrorResponse> handleException(UserInvalidFields ex) {
        ErrorResponse response = new ErrorResponse(
                ex.getMessage(),
                System.currentTimeMillis()
        );

        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler
    private ResponseEntity<ErrorResponse> handleException(UserInvalidUsername ex) {
        ErrorResponse response = new ErrorResponse(
                ex.getMessage(),
                System.currentTimeMillis()
        );

        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler
    private ResponseEntity<ErrorResponse> handleException(UserExistsException ex) {
        ErrorResponse response = new ErrorResponse(
                ex.getMessage(),
                System.currentTimeMillis()
        );

        return new ResponseEntity<>(response, HttpStatus.CONFLICT);
    }

    @ExceptionHandler
    private ResponseEntity<ErrorResponse> handleException(RegistrationException ex) {
        ErrorResponse response = new ErrorResponse(
                ex.getMessage(),
                System.currentTimeMillis()
        );

        return new ResponseEntity<>(response, HttpStatus.CONFLICT);
    }

    @ExceptionHandler
    private ResponseEntity<ErrorResponse> handleException(LoginException ex) {
        ErrorResponse response = new ErrorResponse(
                ex.getMessage(),
                System.currentTimeMillis()
        );

        return new ResponseEntity<>(response, HttpStatus.CONFLICT);
    }

}
