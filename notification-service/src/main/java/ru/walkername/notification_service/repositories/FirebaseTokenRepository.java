package ru.walkername.notification_service.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.walkername.notification_service.models.FirebaseToken;

@Repository
public interface FirebaseTokenRepository extends JpaRepository<FirebaseToken, Long> {
}
