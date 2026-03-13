package ru.walkername.movie_catalog.repositories;

import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;
import ru.walkername.movie_catalog.models.MovieDocument;

@Repository
public interface MovieDocumentRepository extends ElasticsearchRepository<MovieDocument, String> {
}
