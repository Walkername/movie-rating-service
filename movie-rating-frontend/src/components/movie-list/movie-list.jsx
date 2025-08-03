import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import MOVIES from "../../props/props";
import '../../styles/movie-card.css';
import '../../styles/movie-card-bar.css';
import MovieCard from "../movie-card/movie-card";
import MovieViewToggle from "../movie-view-toggle/movie-view-toggle";
import MovieCardBar from "../movie-card-bar/movie-card-bar";
import { getMoviesWithPagination } from "../../api/movie-api";

function MovieList() {

    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [searchParams, setSearchParams] = useSearchParams();

    const pagePar = searchParams.get("page") ? searchParams.get("page") : 0;
    const limitPar = searchParams.get("limit") ? searchParams.get("limit") : 10;
    const sortPar = searchParams.get("sort") ? searchParams.get("sort") : true;

    const [page, setPage] = useState(pagePar);
    const [limit, setLimit] = useState(limitPar);
    const [sort, setSort] = useState(sortPar);

    const [sortBtText, setSortBtText] = useState("Sort ↓");

    const [viewMode, setViewMode] = useState(false);

    const handlePageButton = (value) => {
        setPage(value);
    }

    const handleSortButton = (e) => {
        setSort(!sort);
        setSortBtText((prevText) => (prevText === "Sort ↓" ? "Sort ↑" : "Sort ↓"));
    }

    const handleLimitButton = (e) => {
        const limitValue = e.target.value;
        const newPage = Math.floor((limit * page + 1) / limitValue);
        setPage(newPage);
        setLimit(e.target.value);
    }

    useEffect(() => {
        getMoviesWithPagination(page, limit, sort)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                setMovies(data);
                setLoading(false);
                // Movie props
                // TODO: comment if need movies from backend
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
        navigate(target);
    }

    // NUMBER OF MOVIES IN DB

    const [moviesNumber, setMoviesNumber] = useState(0)

    useEffect(() => {
        const url = `${process.env.REACT_APP_MOVIE_SERVICE_URL}/movies/count`;

        fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch movies");
                }
                return response.json(); // Parse JSON response
            })
            .then((data) => {
                setMoviesNumber(data); // Update movies state with the fetched data
                setLoading(false); // Set loading to false
            })
            .catch((error) => {
                console.error("Error fetching movies:", error);
                setError(error.message); // Set error message
                setLoading(false); // Set loading to false
            });
    });

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
                        movies.map((movie, index) => {
                            if (index < limit) {
                                return viewMode ?
                                    (
                                        <MovieCardBar
                                            movie={movie}
                                            key={index}
                                            handleNavigate={handleNavigate}
                                        />
                                    )
                                    :
                                    (
                                        <MovieCard
                                            movie={movie}
                                            key={index}
                                            handleNavigate={handleNavigate}
                                        />
                                    )
                            }
                        })
                }
            </div>
            <div>
                {
                    Array.from({ length: Math.ceil(moviesNumber / limit) }, (_, index) => (
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
            <button onClick={handleSortButton}>
                {sortBtText}
            </button>
            <select onChange={handleLimitButton}>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
            </select>
        </div>
    )
}

export default MovieList;