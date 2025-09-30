package ru.walkername.file_service.exceptions;

public class FileUploadFailException extends RuntimeException {
    public FileUploadFailException(String message) {
        super(message);
    }
}
