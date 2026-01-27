package ru.walkername.notification_service.services;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import ru.walkername.notification_service.dto.NotificationResponse;

@RequiredArgsConstructor
@Service
public class WebSocketService {

    private final SimpMessagingTemplate messagingTemplate;

    public void broadcastToAll(NotificationResponse notificationResponse) {
        messagingTemplate.convertAndSend(
                "/topic/notifications",
                notificationResponse
        );
    }

}
