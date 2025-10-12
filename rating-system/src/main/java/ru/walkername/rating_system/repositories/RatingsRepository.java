package ru.walkername.rating_system.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.walkername.rating_system.models.Rating;

import java.util.List;
import java.util.Optional;

@Repository
public interface RatingsRepository extends JpaRepository<Rating, Long> {

    Optional<Rating> findByUserIdAndMovieId(Long userId, Long movieId);

    List<Rating> findByUserId(Long id);

    Page<Rating> findAllByUserId(Long id, Pageable pageable);

    List<Rating> findByMovieId(Long id);

    boolean existsByUserIdAndMovieId(Long userId, Long movieId);

    void deleteAllByMovieId(Long movieId);
}
