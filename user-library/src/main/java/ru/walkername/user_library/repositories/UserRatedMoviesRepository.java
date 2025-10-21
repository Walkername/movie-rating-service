package ru.walkername.user_library.repositories;

import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;
import ru.walkername.user_library.models.UserRatedMovie;

@Repository
public interface UserRatedMoviesRepository extends ElasticsearchRepository<UserRatedMovie, String> {
}
