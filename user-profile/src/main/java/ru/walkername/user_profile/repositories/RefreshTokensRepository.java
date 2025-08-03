package ru.walkername.user_profile.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.walkername.user_profile.models.RefreshToken;

import java.util.Optional;

@Repository
public interface RefreshTokensRepository extends JpaRepository<RefreshToken, Integer> {

    Optional<RefreshToken> findByUserId(int userId);

}
