package ru.walkername.movie_catalog.dto;

import java.util.List;

public record PageResponse<T>(
         List<T> content,
         int page,
         int limit,
         long totalElements,
         int totalPages
) {

}
