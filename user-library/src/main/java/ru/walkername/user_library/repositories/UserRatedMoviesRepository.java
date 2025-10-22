package ru.walkername.user_library.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;
import ru.walkername.user_library.models.UserRatedMovie;

@Repository
public interface UserRatedMoviesRepository extends ElasticsearchRepository<UserRatedMovie, String> {

    Page<UserRatedMovie> findByUserIdAndMovieTitleContainingAndDeletedFalse(Long userId, String movieTitle, Pageable pageable);

}
