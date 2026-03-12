package ru.walkername.notification_service.mapper;

import org.mapstruct.Mapper;
import ru.walkername.notification_service.dto.NotificationResponse;
import ru.walkername.notification_service.models.Notification;

@Mapper(componentModel = "spring")
public interface NotificationMapper {

    NotificationResponse toNotificationResponse(Notification notification);

}
