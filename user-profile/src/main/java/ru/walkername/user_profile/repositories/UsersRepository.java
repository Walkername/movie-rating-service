package ru.walkername.user_profile.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import ru.walkername.user_profile.models.User;

import java.util.Optional;

@Repository
public interface UsersRepository extends JpaRepository<User, Integer> {

    Optional<User> findByUsername(String username);

    @Query(value = "SELECT * FROM user_profile GROUP BY id ORDER BY SUM(scores) DESC LIMIT 1", nativeQuery = true)
    Optional<User> findUserWithHighestScores();

}
