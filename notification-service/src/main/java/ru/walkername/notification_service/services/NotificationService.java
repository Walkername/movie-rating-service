package ru.walkername.notification_service.services;

import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.walkername.notification_service.dto.NotificationResponse;
import ru.walkername.notification_service.events.PostCreated;
import ru.walkername.notification_service.models.EntityType;
import ru.walkername.notification_service.models.Notification;
import ru.walkername.notification_service.models.TargetType;
import ru.walkername.notification_service.repositories.NotificationRepository;
import ru.walkername.notification_service.util.NotificationModelMapper;

import java.time.Instant;
import java.util.Map;

@RequiredArgsConstructor
@Service
@Transactional(readOnly = true)
public class NotificationService {

    private final NotificationRepository notificationRepository;

    private final NotificationModelMapper mapper;

    private final WebSocketService webSocketService;

    @Transactional
    @KafkaListener(
            topics = "post-created",
            groupId = "feed-service-group",
            containerFactory = "postCreatedContainerFactory"
    )
    public void handlePostCreated(PostCreated postCreated) {
        Notification notification = new Notification();
        notification.setTargetType(TargetType.ALL);
        notification.setTitle("New post published");
        notification.setMessage("New post from admin: " + postCreated.getTitle());
        notification.setEntityType(EntityType.POST);
        notification.setDeliveredAt(Instant.now());
        notification.setMetadata(
                Map.of(
                        "postId", postCreated.getId(),
                        "postTitle", postCreated.getTitle()
                )
        );

        notificationRepository.save(notification);
        System.out.println("Post published: " + postCreated.getTitle());

        NotificationResponse notificationResponse = mapper.toResponse(notification);

        webSocketService.broadcastToAll(notificationResponse);
    }

}
