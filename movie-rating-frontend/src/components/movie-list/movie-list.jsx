import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function MovieList() {

    const [movies, setMovies] = useState([]); // State to store the list of movies
    const [loading, setLoading] = useState(true); // State to manage loading
    const [error, setError] = useState(null); // State to handle errors

    const [searchParams, setSearchParams] = useSearchParams();

    const pagePar = searchParams.get("page") ? searchParams.get("page") : 0;
    const limitPar = searchParams.get("limit") ? searchParams.get("limit") : 10;
    const sortPar = searchParams.get("sort") ? searchParams.get("sort") : true;

    const [page, setPage] = useState(pagePar);
    const [limit, setLimit] = useState(limitPar);
    const [sort, setSort] = useState(sortPar);

    const [sortBtText, setSortBtText] = useState("Sort ↓");

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
        const url = `${process.env.REACT_APP_MOVIE_SERVICE_URL}/movies?page=${page}&limit=${limit}&down=${sort}`; // Replace with your API endpoint

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
                setMovies(data); // Update movies state with the fetched data
                setLoading(false); // Set loading to false
            })
            .catch((error) => {
                console.error("Error fetching movies:", error);
                setError(error.message); // Set error message
                setLoading(false); // Set loading to false
            });
    }, [page, limit, sort]); // Empty dependency array ensures this runs once when the component mounts

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
        <div>
            <h2 style={{ textAlign: "center" }}>Movie List</h2>
            <div>
                {
                    loading ? (
                        <div>Loading movies...</div>
                    ) : error ? (
                        <div>Error: {error}</div>
                    ) :
                        movies.map((movie, index) => {
                            let href = "/movies/" + movie.id;
                            return (
                                <div key={index} className="movie-div" onClick={() => handleNavigate(href)}>
                                    {(parseInt(page)) * limit + index + 1}: {movie.title} ({movie.releaseYear}):
                                    <span style={{ color: "#FF0000" }}> {movie.averageRating}</span>
                                </div>
                            );
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