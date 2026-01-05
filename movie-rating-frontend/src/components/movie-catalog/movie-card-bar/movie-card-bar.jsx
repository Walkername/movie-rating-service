import { Link } from "react-router-dom";
import './movie-card-bar.css';

function MovieCardBar({ movie, index }) {
    // Форматируем жанры
    const genres = movie.genres || ["Drama", "Action"]; // Заглушка
    
    return (
        <Link className="movie-card-bar" to={`/movie/${movie.id}`}>
            <span className="movie-card-bar__index">
                {index + 1}
            </span>
            
            <div className="movie-card-bar__content">
                <div className="movie-card-bar__header">
                    <span className="movie-card-bar__title">
                        {movie.title}
                    </span>
                    <span className="movie-card-bar__year">
                        ({movie.releaseYear})
                    </span>
                </div>
                
                {movie.description && (
                    <div className="movie-card-bar__description">
                        {movie.description}
                    </div>
                )}
                
                {genres.length > 0 && (
                    <div className="movie-card-bar__meta">
                        {genres.slice(0, 2).map((genre, idx) => (
                            <span key={idx} className="movie-card-bar__genre">
                                {genre}
                            </span>
                        ))}
                        {genres.length > 2 && (
                            <span className="movie-card-bar__genre">
                                +{genres.length - 2} more
                            </span>
                        )}
                    </div>
                )}
            </div>
            
            <div className="movie-card-bar__stats">
                {movie.averageRating && (
                    <div className="movie-card-bar__rating">
                        {movie.averageRating.toFixed(1)}
                    </div>
                )}
                
                {movie.scores !== undefined && (
                    <div className="movie-card-bar__scores">
                        {movie.scores} votes
                    </div>
                )}
            </div>
        </Link>
    );
}

export default MovieCardBar;