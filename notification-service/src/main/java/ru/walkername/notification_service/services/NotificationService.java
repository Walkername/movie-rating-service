package ru.walkername.notification_service.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.walkername.notification_service.repositories.FirebaseTokenRepository;

@RequiredArgsConstructor
@Service
@Transactional(readOnly = true)
public class NotificationService {

    private final FirebaseTokenRepository firebaseTokenRepository;

}
