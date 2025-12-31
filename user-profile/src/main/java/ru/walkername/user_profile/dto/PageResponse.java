package ru.walkername.user_profile.dto;

import java.util.List;

public class PageResponse<T> {

    private List<T> content;

    private int page;

    private int limit;

    private long totalElements;

    private int totalPages;

    public PageResponse(List<T> content, int page, int limit, long totalElements, int totalPages) {
        this.content = content;
        this.page = page;
        this.limit = limit;
        this.totalElements = totalElements;
        this.totalPages = totalPages;
    }

    public List<T> getContent() {
        return content;
    }

    public void setContent(List<T> content) {
        this.content = content;
    }

    public int getPage() {
        return page;
    }

    public void setPage(int page) {
        this.page = page;
    }

    public int getLimit() {
        return limit;
    }

    public void setLimit(int limit) {
        this.limit = limit;
    }

    public long getTotalElements() {
        return totalElements;
    }

    public void setTotalElements(long totalElements) {
        this.totalElements = totalElements;
    }

    public int getTotalPages() {
        return totalPages;
    }

    public void setTotalPages(int totalPages) {
        this.totalPages = totalPages;
    }
}
