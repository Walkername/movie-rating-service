package ru.walkername.movie_catalog.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import ru.walkername.movie_catalog.models.Movie;

import java.util.List;

@Repository
public interface MoviesRepository extends JpaRepository<Movie, Long> {

    @Query("SELECT m.posterPicId FROM Movie m WHERE m.id IN :ids")
    List<Long> findAllPosterPicIdsByIds(List<Long> ids);
}
