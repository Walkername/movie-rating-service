package ru.walkername.file_service.exceptions;

public class InvalidUploadContextException extends RuntimeException {
    public InvalidUploadContextException(String message) {
        super(message);
    }
}
