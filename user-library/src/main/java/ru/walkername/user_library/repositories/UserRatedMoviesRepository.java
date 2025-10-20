package ru.walkername.user_library.repositories;

import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;
import ru.walkername.user_library.models.UserRatedMovie;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRatedMoviesRepository extends ElasticsearchRepository<UserRatedMovie, String> {

    Optional<UserRatedMovie> findByUserIdAndMovieId(Long userId, Long movieId);

    void deleteByUserIdAndMovieId(Long userId, Long movieId);

    List<UserRatedMovie> findByMovieId(Long movieId);

    void deleteAllByMovieId(Long movieId);
}
