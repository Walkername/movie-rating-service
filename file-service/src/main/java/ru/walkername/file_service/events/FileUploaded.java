package ru.walkername.file_service.events;

public record FileUploaded(
        Long fileId,
        Long contextId,
        String context
) {

}
