import { Link } from "react-router-dom";
import './movie-card-bar.css';

function MovieCardBar({ movie, index }) {
    let href = "/movie/" + movie.id;
    return (
        <Link className="movie-card-bar" to={href}>
            <span className="movie-card-bar-index">{index + 1}</span>
            <div className="movie-card-bar-header">
                <span>
                    <span className="movie-card-bar-title"><b>{movie.title}</b></span>
                    <span className="movie-card-bar-year"> ({movie.releaseYear})</span>
                </span>
                <div className="movie-card-bar-description">{movie.description}</div>
            </div>

            <span className="movie-card-bar-rating">{movie.averageRating}</span>
            <span className="movie-card-bar-scores">Scores: {movie.scores}</span>
        </Link>
    );
}

export default MovieCardBar;