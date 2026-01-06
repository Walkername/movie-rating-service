import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import MovieCard from "../movie-card/movie-card";
import MovieViewToggle from "../movie-list-view-toggle/movie-list-view-toggle";
import MovieCardBar from "../movie-card-bar/movie-card-bar";
import { getMoviesWithPagination } from "../../../api/movie-api";
import SortButton from "../sort-button/sort-button";
import "./movie-list.css";

function MovieList() {
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();

    // Параметры из URL
    const pagePar = searchParams.get("page") ? parseInt(searchParams.get("page")) : 0;
    const limitPar = searchParams.get("limit") ? parseInt(searchParams.get("limit")) : 12;
    const sortPar = searchParams.get("sort") ? searchParams.get("sort") : "averageRating:desc";
    const viewmodePar = searchParams.get("viewmode") ? searchParams.get("viewmode") === "true" : false;
    const genrePar = searchParams.get("genre") || "all";

    const [page, setPage] = useState(pagePar);
    const [limit, setLimit] = useState(limitPar);
    const [sort, setSort] = useState(sortPar);
    const sortParams = sortPar.split(":");
    const [sortField, setSortField] = useState(sortParams[0] || "averageRating");
    const [sortOrder, setSortOrder] = useState(sortParams[1] || "desc");
    const [selectedGenre, setSelectedGenre] = useState(genrePar);

    const [pageResponse, setPageResponse] = useState({
        content: [],
        limit: limit,
        page: page,
        totalElements: 0,
        totalPages: 0
    });

    const [viewMode, setViewMode] = useState(viewmodePar);

    // Жанры для фильтрации (можно получать с API)
    const genres = ["all", "action", "drama", "comedy", "horror", "sci-fi", "romance", "thriller"];

    const updateURL = (params) => {
        const searchParams = new URLSearchParams(window.location.search);
        Object.entries(params).forEach(([key, value]) => {
            searchParams.set(key, value);
        });
        const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
        window.history.pushState({}, '', newUrl);
    };

    const handlePageButton = (value) => {
        setPage(value);
        updateURL({ page: value });
    };

    const handleSortButton = (e) => {
        const field = e.target.value;
        const newSort = `${field}:${sortOrder}`;
        setSortField(field);
        setSort(newSort);
        updateURL({ sort: newSort });
    };

    const handleSortOrderButton = () => {
        const order = sortOrder === "desc" ? "asc" : "desc";
        setSortOrder(order);
        const newSort = `${sortField}:${order}`;
        setSort(newSort);
        updateURL({ sort: newSort });
    };

    const handleLimitButton = (e) => {
        const limitValue = parseInt(e.target.value);
        const newPage = Math.floor((limit * page) / limitValue);
        setPage(newPage);
        setLimit(limitValue);
        updateURL({ limit: limitValue, page: newPage });
    };

    const handleGenreFilter = (genre) => {
        setSelectedGenre(genre);
        setPage(0);
        updateURL({ genre, page: 0 });
    };

    useEffect(() => {
        setLoading(true);
        // Здесь можно добавить фильтрацию по жанру, когда будет API
        getMoviesWithPagination(page, limit, sort)
            .then((data) => {
                setPageResponse(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching movies:", error);
                setLoading(false);
            });
    }, [page, limit, sort, selectedGenre]);

    const totalPages = Math.ceil(pageResponse.totalElements / limit);
    const startItem = page * limit + 1;
    const endItem = Math.min((page + 1) * limit, pageResponse.totalElements);

    return (
        <div className="movie-catalog">
            <div className="movie-catalog__header">
                <h2 className="movie-catalog__title">Movie Catalog</h2>
                <div className="movie-catalog__controls">
                    <div className="movie-catalog__filters">
                        {genres.map(genre => (
                            <button
                                key={genre}
                                className={`movie-catalog__filter ${selectedGenre === genre ? 'movie-catalog__filter--active' : ''}`}
                                onClick={() => handleGenreFilter(genre)}
                            >
                                {genre.charAt(0).toUpperCase() + genre.slice(1)}
                            </button>
                        ))}
                    </div>
                    <MovieViewToggle viewMode={viewMode} setViewMode={setViewMode} />
                </div>
            </div>

            <div className="movie-catalog__sort-controls">
                <select 
                    className="movie-catalog__select" 
                    onChange={handleSortButton} 
                    value={sortField}
                >
                    <option value="averageRating">Rating</option>
                    <option value="releaseYear">Release Year</option>
                    <option value="createdAt">Date Added</option>
                </select>
                
                <SortButton 
                    sortOrder={sortOrder} 
                    handleSortOrderButton={handleSortOrderButton} 
                />
                
                <select 
                    className="movie-catalog__select" 
                    onChange={handleLimitButton} 
                    value={limit}
                >
                    <option value={12}>12 per page</option>
                    <option value={24}>24 per page</option>
                    <option value={48}>48 per page</option>
                </select>
            </div>

            <div className="movie-catalog__container">
                {loading ? (
                    <div className="movie-catalog__loading">
                        <div className="movie-catalog__spinner"></div>
                        <div>Loading movies...</div>
                    </div>
                ) : (
                    <div className={viewMode ? 'movie-catalog__list' : 'movie-catalog__grid'}>
                        {viewMode ? (
                            // Список
                            pageResponse.content.map((movie, index) => (
                                <MovieCardBar
                                    movie={movie}
                                    key={movie.id}
                                    index={index + limit * page}
                                />
                            ))
                        ) : (
                            // Сетка
                            <div className="movie-catalog__grid-container">
                                {pageResponse.content.map((movie, index) => (
                                    <MovieCard
                                        movie={movie}
                                        key={movie.id}
                                        index={index + limit * page}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {!loading && pageResponse.content.length > 0 && (
                <>
                    <div className="movie-catalog__stats">
                        <div>
                            Showing {startItem} - {endItem} of {pageResponse.totalElements} movies
                        </div>
                        <div>
                            Page {page + 1} of {totalPages}
                        </div>
                    </div>

                    {totalPages > 1 && (
                        <div className="movie-catalog__pagination">
                            <button
                                className={`movie-catalog__page-button ${page === 0 ? 'movie-catalog__page-button--disabled' : ''}`}
                                onClick={() => handlePageButton(Math.max(0, page - 1))}
                                disabled={page === 0}
                            >
                                Previous
                            </button>
                            
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                let pageNum;
                                if (totalPages <= 5) {
                                    pageNum = i;
                                } else if (page < 3) {
                                    pageNum = i;
                                } else if (page > totalPages - 4) {
                                    pageNum = totalPages - 5 + i;
                                } else {
                                    pageNum = page - 2 + i;
                                }
                                
                                return (
                                    <button
                                        key={pageNum}
                                        className={`movie-catalog__page-button ${page === pageNum ? 'movie-catalog__page-button--active' : ''}`}
                                        onClick={() => handlePageButton(pageNum)}
                                    >
                                        {pageNum + 1}
                                    </button>
                                );
                            })}
                            
                            <button
                                className={`movie-catalog__page-button ${page === totalPages - 1 ? 'movie-catalog__page-button--disabled' : ''}`}
                                onClick={() => handlePageButton(Math.min(totalPages - 1, page + 1))}
                                disabled={page === totalPages - 1}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default MovieList;