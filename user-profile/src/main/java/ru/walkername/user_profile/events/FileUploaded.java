package ru.walkername.user_profile.events;

public record FileUploaded(
        Long fileId,
        Long contextId,
        String context
) {

}
