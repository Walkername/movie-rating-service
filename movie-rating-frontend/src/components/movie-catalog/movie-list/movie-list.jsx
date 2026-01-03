import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
// import MOVIES from "../../../props/props";
import MovieCard from "../movie-card/movie-card";
import MovieViewToggle from "../movie-list-view-toggle/movie-list-view-toggle";
import MovieCardBar from "../movie-card-bar/movie-card-bar";
import { getMoviesWithPagination } from "../../../api/movie-api";
import SortButton from "../sort-button/sort-button";
import "./movie-list.css";

function MovieList() {
    const [loading, setLoading] = useState(true);

    const [searchParams] = useSearchParams();

    const pagePar = searchParams.get("page") ? searchParams.get("page") : 0;
    const limitPar = searchParams.get("limit") ? searchParams.get("limit") : 10;
    const sortPar = searchParams.get("sort") ? searchParams.get("sort") : "averageRating";
    const viewmodePar = searchParams.get("viewmode") ? searchParams.get("viewmode") === "true" : false;

    const [page, setPage] = useState(pagePar);
    const [limit, setLimit] = useState(limitPar);
    const [sort, setSort] = useState(sortPar);
    const sortParams = sortPar.split(":");
    const [sortField, setSortField] = useState(sortParams[0] ? sortParams[0] : "uploadedAt");
    const [sortOrder, setSortOrder] = useState(sortParams[1] ? sortParams[1] : "desc");

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

        // Update URL parameters
        const searchParams = new URLSearchParams(window.location.search);
        searchParams.set('page', value);

        const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
        window.history.pushState({}, '', newUrl);
    };

    const handleSortButton = (e) => {
        const field = e.target.value;
        const newSort = `${field}:${sortOrder}`;
        setSortField(field);
        setSort(newSort);

        // Update URL parameters
        const searchParams = new URLSearchParams(window.location.search);
        searchParams.set('sort', newSort);

        const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
        window.history.pushState({}, '', newUrl);
    };

    const handleSortOrderButton = () => {
        const order = sortOrder === "desc" ? "asc" : "desc";
        setSortOrder(order);
        setSort(`${sortField}:${order}`);

        // Update URL parameters
        const searchParams = new URLSearchParams(window.location.search);
        searchParams.set('sort', `${sortField}:${order}`);
        const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
        window.history.pushState({}, '', newUrl);
    };

    const handleLimitButton = (e) => {
        const limitValue = e.target.value;
        const newPage = Math.floor((limit * page + 1) / limitValue);
        setPage(newPage);
        setLimit(e.target.value);

        // Update URL parameters
        const searchParams = new URLSearchParams(window.location.search);
        searchParams.set('limit', limitValue);
        searchParams.set('page', newPage);

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
                    ) : pageResponse.content.map((movie, index) => {
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
                            return <></>
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
                <select onChange={handleSortButton} value={sortField}>
                    <option value="averageRating">Rating</option>
                    <option value="releaseYear">Release Year</option>
                    <option value="createdAt">Date added</option>
                </select>
                <SortButton sortOrder={sortOrder} handleSortOrderButton={handleSortOrderButton} />
                <select onChange={handleLimitButton} value={limit}>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                </select>
            </div>
        </div>
    )
}

export default MovieList;