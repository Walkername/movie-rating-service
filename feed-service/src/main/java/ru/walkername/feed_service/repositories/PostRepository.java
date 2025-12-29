package ru.walkername.feed_service.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.walkername.feed_service.models.Post;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
}
