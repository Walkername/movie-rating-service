package ru.walkername.notification_service.util;

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;
import ru.walkername.notification_service.dto.NotificationResponse;
import ru.walkername.notification_service.models.Notification;

@RequiredArgsConstructor
@Component
public class NotificationModelMapper {

    private final ModelMapper modelMapper;

    public NotificationResponse toResponse(Notification notification) {
        return modelMapper.map(notification, NotificationResponse.class);
    }

}
