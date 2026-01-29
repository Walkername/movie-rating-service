package ru.walkername.notification_service.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.walkername.notification_service.dto.NotificationResponse;
import ru.walkername.notification_service.dto.PageResponse;
import ru.walkername.notification_service.dto.UserNotificationResponse;
import ru.walkername.notification_service.security.UserPrincipal;
import ru.walkername.notification_service.services.NotificationService;

import java.util.List;

@RequiredArgsConstructor
@RequestMapping("/notifications")
@RestController
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping("")
    public ResponseEntity<PageResponse<UserNotificationResponse>> getNotifications(
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        PageResponse<UserNotificationResponse> notifications = notificationService.getUserNotifications(userPrincipal.getUserId());

        return new ResponseEntity<>(notifications, HttpStatus.OK);
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<HttpStatus> markAsRead(
        @PathVariable("id") Long id,
        @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        notificationService.markAsRead(id, userPrincipal.getUserId());
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PatchMapping("/batch-read")
    public ResponseEntity<NotificationResponse> markAsBatchRead(
            @RequestBody List<Long> notificationIds
    ) {
        notificationService.markAsBatchRead(notificationIds);
        return new ResponseEntity<>(HttpStatus.OK);
    }

}
