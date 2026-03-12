package ru.walkername.feed_service.events;

public record PostCreated(
        Long id,
        String title
) {

}
