import { useEffect, useState } from "react";
import validateDate from "../../../utils/date-validation/date-validation";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import "./rated-movies-list.css";
import {
    getMoviesByUser,
    searchUserMoviesByTitle,
} from "../../../api/user-library-api";
import { useRef } from "react";

function RatedMoviesList({ userId }) {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const pagePar = searchParams.get("page") ? parseInt(searchParams.get("page")) : 0;
    const limitPar = searchParams.get("limit") ? parseInt(searchParams.get("limit")) : 10;
    const sortPar = searchParams.get("sort") ? searchParams.get("sort") : "ratedAt";

    const [page, setPage] = useState(pagePar);
    const [limit, setLimit] = useState(limitPar);
    const [sort, setSort] = useState(`${sortPar}:desc`);
    const sortParams = sortPar.split(":");
    const [sortField, setSortField] = useState(
        sortParams[0] ? sortParams[0] : "ratedAt"
    );
    const [sortOrder, setSortOrder] = useState(
        sortParams[1] ? sortParams[1] : "desc"
    );

    const [pageResponse, setPageResponse] = useState({
        content: [],
        limit: limit,
        page: page,
        totalElements: 0,
        totalPages: 0,
    });

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleSortButton = (columnName) => {
        let order = sortOrder;
        if (sortField === columnName) {
            order = sortOrder === "desc" ? "asc" : "desc";
        }
        const newSort = `${columnName}:${order}`;
        setSortOrder(order);
        setSortField(columnName);
        setSort(newSort);

        const searchParams = new URLSearchParams(window.location.search);
        searchParams.set("sort", newSort);

        const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
        window.history.pushState({}, "", newUrl);
    };

    const handleLimitButton = (e) => {
        const limitValue = parseInt(e.target.value);
        const newPage = Math.floor((limit * page + 1) / limitValue) - 1;
        setPage(Math.max(0, newPage));
        setLimit(limitValue);

        const searchParams = new URLSearchParams(window.location.search);
        searchParams.set("limit", limitValue);
        searchParams.set("page", Math.max(0, newPage));

        const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
        window.history.pushState({}, "", newUrl);
    };

    useEffect(() => {
        setIsLoading(true);
        setError(null);
        
        getMoviesByUser(userId, page, limit, sort)
            .then((data) => {
                setPageResponse(data);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error(error);
                setError("Failed to load rated movies");
                setIsLoading(false);
            });
    }, [userId, page, limit, sort]);

    const handlePageButton = (value) => {
        setPage(value);

        const searchParams = new URLSearchParams(window.location.search);
        searchParams.set("page", value);

        const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
        window.history.pushState({}, "", newUrl);
    };

    // Search movies by Title
    const inputRef = useRef(null);
    const [foundMovies, setFoundMovies] = useState({
        content: [],
        page: 0,
        limit: 10,
        totalElements: 0,
        totalPages: 0,
    });
    const [showDropdown, setShowDropdown] = useState(false);
    const [isFadingOut, setIsFadingOut] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const debounce = (func, delay) => {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func(...args);
            }, delay);
        };
    };

    const handleSearch = debounce((e) => {
        const query = e.target.value;
        setSearchQuery(query);
        if (query.trim() === "") {
            setShowDropdown(false);
            setFoundMovies({
                content: [],
                limit: limit,
                page: page,
                totalElements: 0,
                totalPages: 0,
            });
            return;
        }
        searchUserMoviesByTitle(userId, query)
            .then((data) => {
                setFoundMovies(data);
                setShowDropdown(true);
                setIsFadingOut(false);
            })
            .catch(() => {
                setShowDropdown(false);
                setFoundMovies({ content: [], totalElements: 0 });
            });
    }, 500);

    const handleMovieSelect = (movieId) => {
        navigate(`/movie/${movieId}`);
        setShowDropdown(false);
        setSearchQuery("");
        if (inputRef.current) {
            inputRef.current.value = "";
        }
    };

    const handleFocus = () => {
        if (searchQuery.trim() && foundMovies.content.length > 0) {
            setShowDropdown(true);
            setIsFadingOut(false);
        }
    };

    const handleBlur = () => {
        setIsFadingOut(true);
        setTimeout(() => {
            setShowDropdown(false);
            setIsFadingOut(false);
        }, 150);
    };

    const getRatingClass = (rating) => {
        if (rating >= 8) return "rated-movies__rating--high";
        if (rating >= 6) return "rated-movies__rating--medium";
        return "rated-movies__rating--low";
    };

    const renderSortIndicator = (field) => {
        if (sortField !== field) return null;
        
        return (
            <span className="rated-movies__sort-indicator">
                        <span className={`rated-movies__sort-arrow ${sortOrder === 'asc' ? 'rated-movies__sort-arrow--asc' : 'rated-movies__sort-arrow--desc'}`}>
                            ▲
                        </span>
                    </span>
        );
    };

    const renderPagination = () => {
        const totalPages = Math.ceil(pageResponse.totalElements / limit);
        if (totalPages <= 1) return null;

        const pages = [];
        const maxVisible = 5;
        let start = Math.max(0, page - Math.floor(maxVisible / 2));
        let end = Math.min(totalPages, start + maxVisible);

        if (end - start < maxVisible) {
            start = Math.max(0, end - maxVisible);
        }

        if (start > 0) {
            pages.push(
                <button
                    key="first"
                    className="rated-movies__page-button"
                    onClick={() => handlePageButton(0)}
                >
                    1
                </button>
            );
            if (start > 1) {
                pages.push(<span key="dots1" className="rated-movies__page-dots">...</span>);
            }
        }

        for (let i = start; i < end; i++) {
            pages.push(
                <button
                    key={i}
                    className={`rated-movies__page-button ${page === i ? 'rated-movies__page-button--active' : ''}`}
                    onClick={() => handlePageButton(i)}
                >
                    {i + 1}
                </button>
            );
        }

        if (end < totalPages) {
            if (end < totalPages - 1) {
                pages.push(<span key="dots2" className="rated-movies__page-dots">...</span>);
            }
            pages.push(
                <button
                    key="last"
                    className="rated-movies__page-button"
                    onClick={() => handlePageButton(totalPages - 1)}
                >
                    {totalPages}
                </button>
            );
        }

        return pages;
    };

    return (
        <div className="rated-movies">
            <h2 className="rated-movies__title">🎬 Rated Movies</h2>
            
            <div className="rated-movies__controls">
                <div className="rated-movies__search">
                    <input
                        type="text"
                        className="rated-movies__search-input"
                        onChange={handleSearch}
                        ref={inputRef}
                        placeholder="Search rated movies..."
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                    />
                    {showDropdown && (
                        <div className={`rated-movies__search-results ${isFadingOut ? 'fade-out' : 'fade-in'}`}>
                            {foundMovies.content.length > 0 ? (
                                foundMovies.content.slice(0, 5).map((movie, index) => (
                                    <button
                                        key={index}
                                        className="rated-movies__search-result"
                                        onClick={() => handleMovieSelect(movie.movieId)}
                                    >
                                        <span className="rated-movies__search-result-title">
                                            {movie.movieTitle}
                                        </span>
                                        <span className="rated-movies__search-result-year">
                                            ({movie.movieReleaseYear})
                                        </span>
                                    </button>
                                ))
                            ) : (
                                <div className="rated-movies__search-result rated-movies__search-result--empty">
                                    No movies found
                                </div>
                            )}
                        </div>
                    )}
                </div>
                
                <div className="rated-movies__limit">
                    <label htmlFor="limit-select" className="rated-movies__limit-label">
                        Show:
                    </label>
                    <select
                        id="limit-select"
                        className="rated-movies__limit-select"
                        onChange={handleLimitButton}
                        value={limit}
                    >
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                    </select>
                </div>
            </div>

            {error ? (
                <div className="rated-movies__error">
                    <p>{error}</p>
                </div>
            ) : pageResponse.content.length === 0 ? (
                <div className="rated-movies__empty">
                    <div className="rated-movies__empty-icon">🎬</div>
                    <h3>No Rated Movies Yet</h3>
                    <p>Start rating movies to see them here!</p>
                    <Link to="/" className="rated-movies__empty-link">
                        Browse Movies
                    </Link>
                </div>
            ) : (
                <>
                    <div className="rated-movies__table-container">
                        <table className="rated-movies__table">
                            <thead>
                                <tr>
                                    <th>№</th>
                                    <th>Title</th>
                                    <th 
                                        className="rated-movies__sortable-header"
                                        onClick={() => handleSortButton("movieReleaseYear")}
                                    >
                                        Release Year
                                        {renderSortIndicator("movieReleaseYear")}
                                    </th>
                                    <th 
                                        className="rated-movies__sortable-header"
                                        onClick={() => handleSortButton("movieAverageRating")}
                                    >
                                        Avg Rating
                                        {renderSortIndicator("movieAverageRating")}
                                    </th>
                                    <th 
                                        className="rated-movies__sortable-header"
                                        onClick={() => handleSortButton("rating")}
                                    >
                                        Your Rating
                                        {renderSortIndicator("rating")}
                                    </th>
                                    <th 
                                        className="rated-movies__sortable-header"
                                        onClick={() => handleSortButton("ratedAt")}
                                    >
                                        Rated On
                                        {renderSortIndicator("ratedAt")}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {pageResponse.content.map((element, index) => (
                                    <tr
                                        key={index}
                                        className="rated-movies__table-row"
                                        onClick={() => navigate(`/movie/${element.movieId}`)}
                                    >
                                        <td className="rated-movies__table-cell rated-movies__table-cell--number">
                                            {index + 1 + limit * page}
                                        </td>
                                        <td className="rated-movies__table-cell rated-movies__table-cell--title">
                                            {element.movieTitle}
                                        </td>
                                        <td className="rated-movies__table-cell">
                                            {element.movieReleaseYear}
                                        </td>
                                        <td className="rated-movies__table-cell">
                                            {element.movieAverageRating ? element.movieAverageRating.toFixed(1) : "—"}
                                        </td>
                                        <td className={`rated-movies__table-cell ${getRatingClass(element.rating)}`}>
                                            {element.rating}/10
                                        </td>
                                        <td className="rated-movies__table-cell">
                                            {validateDate(element.ratedAt)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {pageResponse.totalElements > 0 && (
                        <div className="rated-movies__pagination">
                            <button
                                className="rated-movies__page-button rated-movies__page-button--prev"
                                onClick={() => handlePageButton(Math.max(0, page - 1))}
                                disabled={page === 0}
                            >
                                ← Previous
                            </button>
                            
                            <div className="rated-movies__page-numbers">
                                {renderPagination()}
                            </div>
                            
                            <button
                                className="rated-movies__page-button rated-movies__page-button--next"
                                onClick={() => handlePageButton(Math.min(pageResponse.totalPages - 1, page + 1))}
                                disabled={page >= pageResponse.totalPages - 1}
                            >
                                Next →
                            </button>
                        </div>
                    )}
                </>
            )}

            <div className="rated-movies__summary">
                <span className="rated-movies__summary-text">
                    Showing {pageResponse.content.length} of {pageResponse.totalElements} rated movies
                </span>
                <span className="rated-movies__summary-page">
                    Page {page + 1} of {pageResponse.totalPages || 1}
                </span>
            </div>
        </div>
    );
}

export default RatedMoviesList;