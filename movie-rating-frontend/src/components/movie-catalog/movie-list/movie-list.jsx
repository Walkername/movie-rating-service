import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import MOVIES from "../../../props/props";
import '../../../styles/movie-card.css';
import '../../../styles/movie-card-bar.css';
import '../../../styles/sort-button.css';
import MovieCard from "../movie-card/movie-card";
import MovieViewToggle from "../movie-view-toggle/movie-view-toggle";
import MovieCardBar from "../movie-card-bar/movie-card-bar";
import { getMoviesNumber, getMoviesWithPagination } from "../../../api/movie-api";

function MovieList() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [searchParams, setSearchParams] = useSearchParams();

    const pagePar = searchParams.get("page") ? searchParams.get("page") : 0;
    const limitPar = searchParams.get("limit") ? searchParams.get("limit") : 10;
    const sortPar = searchParams.get("sort") ? searchParams.get("sort") : "averageRating";
    const viewmodePar = searchParams.get("viewmode") ? searchParams.get("viewmode") === "true" : false;

    const [page, setPage] = useState(pagePar);
    const [limit, setLimit] = useState(limitPar);
    const [sort, setSort] = useState(sortPar);
    const [sortField, setSortField] = useState("averageRating");
    const [sortOrder, setSortOrder] = useState("desc");

    const [pageResponse, setPageResponse] = useState({
        content: [],
        limit: limit,
        page: page,
        totalElements: 0,
        totalPages: 0
    });

    const [viewMode, setViewMode] = useState(viewmodePar);

    const handlePageButton = (value) => {
        setPage(value);
    };

    const handleSortButton = (e) => {
        const field = e.target.value;
        const newSort = `${field}:${sortOrder}`;
        setSortField(field);
        setSort(newSort);

        // Обновляем URL параметр
        const searchParams = new URLSearchParams(window.location.search);
        searchParams.set('sort', newSort);

        const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
        window.history.pushState({}, '', newUrl);
    };

    const handleSortOrderButton = (e) => {
        const order = sortOrder === "desc" ? "asc" : "desc";
        setSortOrder(order);
        setSort(`${sortField}:${order}`);
    };

    const handleLimitButton = (e) => {
        const limitValue = e.target.value;
        const newPage = Math.floor((limit * page + 1) / limitValue);
        setPage(newPage);
        setLimit(e.target.value);

        // Обновляем URL параметр
        const searchParams = new URLSearchParams(window.location.search);
        searchParams.set('limit', limitValue);
        searchParams.set('page', newPage); // также обновляем страницу

        const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
        window.history.pushState({}, '', newUrl);
    };

    useEffect(() => {
        getMoviesWithPagination(page, limit, sort)
            .then((data) => {
                setPageResponse(data);
                setLoading(false);
                // Movie props
                // setMovies(MOVIES);
            })
            .catch((error) => {
                console.error("Error fetching movies:", error);
                setError(error.message);
                setLoading(false);
            });
    }, [page, limit, sort]);

    const navigate = useNavigate();

    const handleNavigate = (target) => {
        window.open(target, "_blank");
        navigate(target);
    };

    return (
        <div className="movie-list-container">
            <h2 style={{ textAlign: "center" }}>Catalog</h2>
            <MovieViewToggle viewMode={viewMode} setViewMode={setViewMode} />

            <div className="movie-card-container" style={{ display: viewMode ? 'block' : 'grid' }}>
                {
                    loading ? (
                        <div>Loading movies...</div>
                    ) : error ? (
                        <div>Error: {error}</div>
                    ) :
                        pageResponse.content.map((movie, index) => {
                            if (index < limit) {
                                return viewMode ?
                                    (
                                        <MovieCardBar
                                            movie={movie}
                                            key={index}
                                            index={index + limit * page}
                                            handleNavigate={handleNavigate}
                                        />
                                    )
                                    :
                                    (
                                        <MovieCard
                                            movie={movie}
                                            key={index}
                                            index={index + limit * page}
                                            handleNavigate={handleNavigate}
                                        />
                                    )
                            }
                        })
                }
            </div>
            <div>
                {
                    Math.ceil(pageResponse.totalElements / limit) > 1 &&
                    Array.from({ length: Math.ceil(pageResponse.totalElements / limit) }, (_, index) => (
                        <button
                            className="page-button"
                            key={index}
                            onClick={() => handlePageButton(index)}
                        >
                            {index + 1}
                        </button>
                    ))
                }
            </div>
            <div
                style={{
                    display: "flex",
                    gap: "5px",
                    margin: "5px"
                }}
            >
                <select onChange={handleSortButton}>
                    <option value="averageRating">Rating</option>
                    <option value="releaseYear">Release Year</option>
                    <option value="createdAt">Date added</option>
                </select>
                <button className={`sort-order-button sort-order-${sortOrder}`} onClick={handleSortOrderButton}>
                    <span className="sort-order-icon"></span>
                </button>
                <select onChange={handleLimitButton}>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                </select>
            </div>
        </div>
    )
}

export default MovieList;