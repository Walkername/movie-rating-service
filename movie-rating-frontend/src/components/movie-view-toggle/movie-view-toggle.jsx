import { useState } from "react";

function MovieViewToggle({ setDisplayMovies }) {
    const [viewMode, setViewMode] = useState(false);

    const toggleViewMode = () => {
        setViewMode(!viewMode);
        setDisplayMovies(!viewMode);
    };

    return (
        <button className="toggle-view-mode"
            onClick={toggleViewMode}
        > {
                viewMode === false ?
                    <span className="movie-bars-icon">
                        <span className="movie-bar"></span>
                        <span className="movie-bar"></span>
                        <span className="movie-bar"></span>
                    </span>
                    :
                    <span className="movie-tiles-icon">
                        <span className="movie-tile"></span>
                        <span className="movie-tile"></span>
                        <span className="movie-tile"></span>
                        <span className="movie-tile"></span>
                    </span>
            }
        </button>
    );
}

export default MovieViewToggle;