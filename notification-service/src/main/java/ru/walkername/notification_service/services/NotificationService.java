package ru.walkername.notification_service.services;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.walkername.notification_service.dto.NotificationResponse;
import ru.walkername.notification_service.dto.PageResponse;
import ru.walkername.notification_service.dto.UserNotificationResponse;
import ru.walkername.notification_service.events.PostCreated;
import ru.walkername.notification_service.exceptions.NotificationNotFound;
import ru.walkername.notification_service.models.EntityType;
import ru.walkername.notification_service.models.Notification;
import ru.walkername.notification_service.models.TargetType;
import ru.walkername.notification_service.models.UserNotification;
import ru.walkername.notification_service.repositories.NotificationRepository;
import ru.walkername.notification_service.repositories.UserNotificationRepository;
import ru.walkername.notification_service.util.NotificationModelMapper;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@Service
@Transactional(readOnly = true)
public class NotificationService {

    private final NotificationRepository notificationRepository;

    private final UserNotificationRepository userNotificationRepository;

    private final NotificationModelMapper mapper;

    private final WebSocketService webSocketService;

    @Transactional
    public PageResponse<UserNotificationResponse> getUserNotifications(Long userId) {
        Sort sort = Sort.by(Sort.Direction.DESC, "deliveredAt");
        PageRequest pageRequest = PageRequest.of(0, 10, sort);

        userNotificationRepository.createMissingUserNotifications(userId);

        Page<UserNotificationResponse> page = userNotificationRepository.findUserNotifications(userId, pageRequest);

        return new PageResponse<>(
                page.getContent(),
                0,
                10,
                page.getTotalElements(),
                page.getTotalPages()
        );
    }

    @Transactional
    @Scheduled(cron = "0 0 6 * * ?")
    public void cleanupExpiredNotifications() {
        userNotificationRepository.deleteExpired();
        notificationRepository.deleteExpired();
    }

    @Transactional
    public void markAsRead(Long id, Long userId) {
        UserNotification userNotification = userNotificationRepository.findByNotificationIdAndUserId(id, userId).orElseThrow(
                () -> new NotificationNotFound("UserNotification not found")
        );
        userNotification.setRead(true);
        userNotification.setReadAt(Instant.now());
    }

    @Transactional
    public void markAsBatchRead(List<Long> ids) {
        userNotificationRepository.markAsReadByIds(ids);
    }

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
        notification.setCreatedAt(Instant.now());
        notification.setExpiresAt(Instant.now().plus(14, ChronoUnit.DAYS));
        notification.setMetadata(
                Map.of(
                        "postId", postCreated.getId(),
                        "postTitle", postCreated.getTitle()
                )
        );

        notificationRepository.save(notification);

        NotificationResponse notificationResponse = mapper.toResponse(notification);

        webSocketService.broadcastToAll(notificationResponse);
    }

}
