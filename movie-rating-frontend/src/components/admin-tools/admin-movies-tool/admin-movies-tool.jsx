import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AddMovieForm from "../add-movie-form/add-movie-form";
import { getMovie, searchMovieByTitle } from "../../../api/movie-api";
import MovieDetails from "../../movie/movie-details/movie-details";
import MovieCardBar from "../../movie-catalog/movie-card-bar/movie-card-bar";
import "./admin-movies-tool.css";

function AdminMoviesTool() {
    const navigate = useNavigate();
    const [movieTool, setMovieTool] = useState("add-movie");
    const [activeSearchTab, setActiveSearchTab] = useState("id");
    const [idToSend, setIdToSend] = useState("");
    const [titleToSend, setTitleToSend] = useState("");
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchError, setSearchError] = useState("");

    const handleNavigate = (target) => {
        navigate(target);
    };

    const chooseMovieTool = (e) => {
        setMovieTool(e.target.value);
        setMovies([]);
        setSearchError("");
        setIdToSend("");
        setTitleToSend("");
    };

    const handleGetMovieById = async (e) => {
        e.preventDefault();
        if (!idToSend.trim()) {
            setSearchError("Please enter a movie ID");
            return;
        }

        setLoading(true);
        setSearchError("");

        try {
            const data = await getMovie(idToSend);
            setMovies([data]);
            setSearchError("");
        } catch (error) {
            console.error("Error fetching movie by ID:", error);
            setMovies([]);
            setSearchError(
                "Movie not found. Please check the ID and try again.",
            );
        } finally {
            setLoading(false);
        }
    };

    const handleGetMovieByTitle = async (e) => {
        e.preventDefault();
        if (!titleToSend.trim()) {
            setSearchError("Please enter a movie title");
            return;
        }

        setLoading(true);
        setSearchError("");

        try {
            const data = await searchMovieByTitle(titleToSend);
            setMovies(data);
            if (data.length === 0) {
                setSearchError("No movies found with that title.");
            } else {
                setSearchError("");
            }
        } catch (error) {
            console.error("Error searching movies by title:", error);
            setMovies([]);
            setSearchError("Error searching for movies. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleIdInput = (e) => {
        setIdToSend(e.target.value);
        setSearchError("");
    };

    const handleTitleInput = (e) => {
        setTitleToSend(e.target.value);
        setSearchError("");
    };

    const clearResults = () => {
        setMovies([]);
        setIdToSend("");
        setTitleToSend("");
        setSearchError("");
    };

    // Обработка клавиатурных сокращений
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "k") {
                e.preventDefault();
                setMovieTool("search-movie");
                document.getElementById("movie-search-input")?.focus();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    const renderMovieTool = () => {
        switch (movieTool) {
            case "add-movie":
                return <AddMovieForm />;
            case "search-movie":
                return (
                    <div className="movie-search-container">
                        <div className="search-tabs">
                            <button
                                className={`search-tab ${activeSearchTab === "id" ? "active" : ""}`}
                                onClick={() => setActiveSearchTab("id")}
                                type="button"
                            >
                                Search by ID
                            </button>
                            <button
                                className={`search-tab ${activeSearchTab === "title" ? "active" : ""}`}
                                onClick={() => setActiveSearchTab("title")}
                                type="button"
                            >
                                Search by Title
                            </button>
                        </div>

                        <div className="search-form">
                            {activeSearchTab === "id" ? (
                                <form onSubmit={handleGetMovieById}>
                                    <div className="search-form-group">
                                        <label htmlFor="movie-id">
                                            Movie ID
                                        </label>
                                        <input
                                            id="movie-id"
                                            type="text"
                                            value={idToSend}
                                            onChange={handleIdInput}
                                            placeholder="Enter movie ID..."
                                            className="search-input"
                                            disabled={loading}
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="search-submit"
                                        disabled={!idToSend.trim() || loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="search-spinner"></span>
                                                Searching...
                                            </>
                                        ) : (
                                            "Search by ID"
                                        )}
                                    </button>
                                </form>
                            ) : (
                                <form onSubmit={handleGetMovieByTitle}>
                                    <div className="search-form-group">
                                        <label htmlFor="movie-title">
                                            Movie Title
                                        </label>
                                        <input
                                            id="movie-title"
                                            type="text"
                                            value={titleToSend}
                                            onChange={handleTitleInput}
                                            placeholder="Enter movie title..."
                                            className="search-input"
                                            disabled={loading}
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="search-submit"
                                        disabled={
                                            !titleToSend.trim() || loading
                                        }
                                    >
                                        {loading ? (
                                            <>
                                                <span className="search-spinner"></span>
                                                Searching...
                                            </>
                                        ) : (
                                            "Search by Title"
                                        )}
                                    </button>
                                </form>
                            )}

                            {searchError && (
                                <div
                                    className={`error-message ${movies.length > 0 ? "info" : "error"}`}
                                >
                                    {searchError}
                                </div>
                            )}

                            {movies.length > 0 && (
                                <button
                                    type="button"
                                    onClick={clearResults}
                                    className="search-submit secondary"
                                    style={{ marginTop: "var(--spacing-md)" }}
                                >
                                    Clear Results
                                </button>
                            )}
                        </div>
                    </div>
                );
            default:
                return <AddMovieForm />;
        }
    };

    return (
        <div className="admin-movies-tool">
            <div className="movies-tool-header">
                <h2>Movie Management</h2>
                <p className="subtitle">
                    Add new movies or search existing ones
                </p>
                <p className="keyboard-hint">
                    Press <kbd>Ctrl+K</kbd> to quickly switch to search
                </p>
            </div>

            <div className="movies-tool-selector">
                <label htmlFor="movie-tool" className="selector-label">
                    Select Tool
                </label>
                <select
                    id="movie-tool"
                    onChange={chooseMovieTool}
                    value={movieTool}
                    className="movie-tool-select"
                >
                    <option value="add-movie">Add New Movie</option>
                    <option value="search-movie">Search Movies</option>
                </select>
            </div>

            <div className="movie-tool-container">{renderMovieTool()}</div>

            {/* Результаты поиска */}
            {movies.length > 0 && (
                <div className="movie-search-results">
                    <div className="results-header">
                        <h3 className="results-title">
                            {movies.length === 1
                                ? "Movie Found"
                                : "Movies Found"}
                        </h3>
                        <span className="results-count">
                            {movies.length}{" "}
                            {movies.length === 1 ? "result" : "results"}
                        </span>
                    </div>

                    {loading ? (
                        <div className="search-loading">
                            <div className="search-spinner"></div>
                            <p>Loading results...</p>
                        </div>
                    ) : movies.length === 1 ? (
                        <div className="movie-details-container">
                            <MovieDetails movie={movies[0]} />
                        </div>
                    ) : (
                        <div className="movie-results-grid">
                            {movies.map((movie, index) => (
                                <div
                                    key={movie.id || index}
                                    className="movie-result-card"
                                >
                                    <MovieCardBar
                                        movie={movie}
                                        index={index}
                                        handleNavigate={handleNavigate}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {movies.length === 0 &&
                !loading &&
                movieTool === "search-movie" &&
                !searchError && (
                    <div className="no-results">
                        <div className="no-results-icon">🎬</div>
                        <p>
                            No movies to display. Use the search form above to
                            find movies.
                        </p>
                    </div>
                )}
        </div>
    );
}

export default AdminMoviesTool;
