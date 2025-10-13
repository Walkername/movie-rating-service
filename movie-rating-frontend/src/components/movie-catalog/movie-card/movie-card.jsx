import { Link } from "react-router-dom";
import './movie-card.css';

function MovieCard({ movie }) {
    let href = "/movie/" + movie.id;
    return (
        <Link className="movie-card" to={href}>
            <div className="movie-card-header">
                <span className="movie-card-title"><b>{movie.title} ({movie.releaseYear})</b></span>
                <span className="movie-card-rating">{movie.averageRating}</span>
            </div>
            <span style={{ color: "#FF0000" }}></span>
            <p className="movie-card-description">{movie.description}</p>
        </Link>
    );
}

export default MovieCard;
