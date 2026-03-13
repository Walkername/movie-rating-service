package ru.walkername.movie_catalog.services;

import co.elastic.clients.elasticsearch._types.query_dsl.Operator;
import co.elastic.clients.elasticsearch._types.query_dsl.QueryBuilders;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.elasticsearch.client.elc.NativeQueryBuilder;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.data.elasticsearch.core.mapping.IndexCoordinates;
import org.springframework.data.elasticsearch.core.query.Criteria;
import org.springframework.data.elasticsearch.core.query.CriteriaQuery;
import org.springframework.data.elasticsearch.core.query.DeleteQuery;
import org.springframework.data.elasticsearch.core.query.Query;
import org.springframework.data.elasticsearch.core.query.UpdateQuery;
import org.springframework.stereotype.Service;
import ru.walkername.movie_catalog.dto.MovieResponse;
import ru.walkername.movie_catalog.dto.PageResponse;
import ru.walkername.movie_catalog.mapper.MovieMapper;
import ru.walkername.movie_catalog.models.MovieDocument;
import ru.walkername.movie_catalog.repositories.MovieDocumentRepository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
public class MovieDocumentService {

    private final MovieDocumentRepository movieDocumentRepository;
    private final ElasticsearchOperations elasticsearchOperations;
    private final IndexCoordinates indexCoordinates;
    private final MovieMapper movieMapper;

    @Autowired
    public MovieDocumentService(
            MovieDocumentRepository movieDocumentRepository,
            ElasticsearchOperations elasticsearchOperations,
            @Value("${spring.elasticsearch.index.movies}")
            String indexName,
            MovieMapper movieMapper
    ) {
        this.movieDocumentRepository = movieDocumentRepository;
        this.elasticsearchOperations = elasticsearchOperations;
        this.indexCoordinates = IndexCoordinates.of(indexName);
        this.movieMapper = movieMapper;
    }

    public void create(MovieDocument movieDocument) {
        try {
            movieDocumentRepository.save(movieDocument);
        } catch (Exception e) {
            log.error("Failed to create movie document for id={}", movieDocument.getId(), e);
            throw e;
        }
    }

    public void update(MovieDocument movieDocument) {
        Map<String, Object> params = new HashMap<>();
        params.put("title", movieDocument.getTitle());
        params.put("releaseYear", movieDocument.getReleaseYear());
        params.put("description", movieDocument.getDescription());

        String script = """
                    if (ctx._source.title != params.title) {
                        ctx._source.title = params.title;
                    }
                    if (ctx._source.description != params.description) {
                        ctx._source.description = params.description;
                    }
                    if (ctx._source.releaseYear != params.releaseYear) {
                        ctx._source.releaseYear = params.releaseYear;
                    }
                """;

        try {
            UpdateQuery updateQuery = UpdateQuery.builder(movieDocument.getId())
                    .withScript(script)
                    .withParams(params)
                    .withAbortOnVersionConflict(false)
                    .withRetryOnConflict(5)
                    .build();

            elasticsearchOperations.update(updateQuery, indexCoordinates);
        } catch (Exception e) {
            log.error("Failed to update movie document for id={}", movieDocument.getId(), e);
        }
    }

    public void delete(Long id) {
        Criteria criteria = new Criteria("id").is(id);
        CriteriaQuery criteriaQuery = new CriteriaQuery(criteria);
        DeleteQuery deleteQuery = DeleteQuery.builder(criteriaQuery).build();

        try {
            elasticsearchOperations.delete(deleteQuery, MovieDocument.class);
        } catch (Exception e) {
            log.error("Failed to delete movie document for id={}", id, e);
            throw e;
        }
    }

    public PageResponse<MovieResponse> searchMoviesByTitle(String query) {
        int page = 0;
        int limit = 10;

        PageRequest pageRequest = PageRequest.of(page, limit);

        var prefixQuery = QueryBuilders
                .prefix(p -> p
                        .field("title")
                        .value(query.toLowerCase())
                );

        var fuzzyQuery = QueryBuilders
                .match(m -> m
                        .field("title")
                        .query(query)
                        .fuzziness("auto")
                        .operator(Operator.Or)
                );

        var wildcardQuery = QueryBuilders
                .wildcard(w -> w
                        .field("title")
                        .value("*" + query.toLowerCase() + "*")
                );

        var boolQuery = QueryBuilders
                .bool(b -> b
                        .should(prefixQuery)
                        .should(fuzzyQuery)
                        .should(wildcardQuery)
                        .minimumShouldMatch("1")
                );

        Query nativeQuery = new NativeQueryBuilder()
                .withQuery(boolQuery)
                .withPageable(pageRequest)
                .build();

        SearchHits<MovieDocument> searchHits = elasticsearchOperations.search(nativeQuery, MovieDocument.class);

        List<MovieResponse> responses = searchHits.getSearchHits().stream()
                .map(hit -> movieMapper.toMovieResponse(hit.getContent()))
                .toList();

        long totalHits = searchHits.getTotalHits();
        int totalPages = (int) Math.ceil((double) totalHits / limit);

        return new PageResponse<>(
                responses,
                page,
                limit,
                totalHits,
                totalPages
        );
    }

}
