import { useEffect, useState } from "react";
import validateDate from "../../../utils/date-validation/date-validation";
import { downloadFile } from "../../../api/file-api";
import "./movie-details.css";
import unknownMoviePoster from "../../../assets/images/unknown-movie-poster.png";

function MovieDetails({ isAccessToEdit, movie, handleEdit }) {
    const [posterPicUrl, setPosterPicUrl] = useState(null);
    const [isPosterLoading, setIsPosterLoading] = useState(true);

    useEffect(() => {
        if (!movie.posterPicId) {
            setIsPosterLoading(false);
            return;
        }
        
        setIsPosterLoading(true);
        downloadFile(movie.posterPicId)
            .then((data) => {
                setPosterPicUrl(data);
            })
            .catch((error) => {
                console.error("Error loading poster:", error);
            })
            .finally(() => {
                setIsPosterLoading(false);
            });
    }, [movie.posterPicId]);

    // Определяем цвет рейтинга
    const getRatingColorClass = () => {
        if (!movie.averageRating) return '';
        if (movie.averageRating >= 8.0) return 'movie-details__rating--high';
        if (movie.averageRating >= 5.0) return 'movie-details__rating--medium';
        return 'movie-details__rating--low';
    };

    // Форматируем дату
    const formattedDate = validateDate(movie.createdAt);

    return (
        <div className="movie-details">
            <div className="movie-details__poster">
                {isPosterLoading ? (
                    <div className="movie-details__poster-loading">
                        <div className="movie-details__poster-spinner"></div>
                    </div>
                ) : (
                    <img
                        className="movie-details__poster-img"
                        src={posterPicUrl || unknownMoviePoster}
                        alt={`${movie.title} poster`}
                        onError={(e) => {
                            e.target.src = unknownMoviePoster;
                        }}
                    />
                )}
                
                {/* Бейдж для высокого рейтинга */}
                {movie.averageRating >= 8.0 && (
                    <div className="movie-details__poster-badge">
                        Top Rated
                    </div>
                )}
            </div>
            
            <div className="movie-details__content">
                <div className="movie-details__header">
                    <h1 className="movie-details__title">
                        {movie.title}
                        <span className="movie-details__year">({movie.releaseYear})</span>
                    </h1>
                    
                    {movie.averageRating > 0 && (
                        <div className={`movie-details__rating ${getRatingColorClass()}`}>
                            {movie.averageRating.toFixed(1)}
                        </div>
                    )}
                </div>
                
                <div className="movie-details__info">
                    <div className="movie-details__description">
                        {movie.description}
                    </div>
                    
                    <div className="movie-details__stats">
                        <div className="movie-details__stat">
                            <span className="movie-details__stat-value">
                                {movie.averageRating > 0 ? movie.averageRating.toFixed(1) : '—'}
                            </span>
                            <span className="movie-details__stat-label">Rating</span>
                        </div>
                        
                        <div className="movie-details__stat">
                            <span className="movie-details__stat-value">
                                {movie.scores || 0}
                            </span>
                            <span className="movie-details__stat-label">Votes</span>
                        </div>
                        
                        <div className="movie-details__stat">
                            <span className="movie-details__stat-value">
                                {movie.releaseYear}
                            </span>
                            <span className="movie-details__stat-label">Year</span>
                        </div>
                    </div>
                    
                    <div className="movie-details__meta">
                        <div className="movie-details__meta-item">
                            <strong>Release Year:</strong> {movie.releaseYear}
                        </div>
                        <div className="movie-details__meta-item">
                            <strong>Scores:</strong> {movie.scores || 0}
                        </div>
                        <div className="movie-details__meta-item">
                            <strong>Added:</strong> {formattedDate}
                        </div>
                    </div>
                </div>
                
                {isAccessToEdit && (
                    <div className="movie-details__actions">
                        <button 
                            className="movie-details__edit-button"
                            onClick={handleEdit}
                        >
                            Edit Movie Details
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MovieDetails;