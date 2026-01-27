import { Link } from "react-router-dom";
import { useState } from "react";
import "./movie-card.css";

function MovieCard({ movie, index }) {
    const [isFavorite, setIsFavorite] = useState(false);

    // Определяем бейдж в зависимости от рейтинга или новизны
    const getBadgeType = () => {
        if (movie.averageRating >= 8.0) return "popular";
        if (
            new Date(movie.createdAt) >
            new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        )
            return "new";
        return null;
    };

    const badgeType = getBadgeType();
    const badgeText = badgeType === "popular" ? "Popular" : "New";

    // Форматируем жанры (предполагаем, что movie.genres - это массив строк)
    const genres = movie.genres || ["Drama", "Action"]; // Заглушка

    const handleFavoriteClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsFavorite(!isFavorite);
        // Здесь можно добавить API вызов для добавления в избранное
    };

    return (
        <Link className="movie-card" to={`/movie/${movie.id}`}>
            {/* Постер фильма */}
            <div className="movie-card__poster">
                {movie.posterPicUrl ? (
                    <img
                        src={movie.posterPicUrl}
                        alt={`${movie.title} poster`}
                        className="movie-card__poster-img"
                    />
                ) : (
                    <div className="movie-card__poster-placeholder">
                        <span className="movie-card__poster-text">
                            {movie.title}
                        </span>
                    </div>
                )}
            </div>

            {/* Бейдж */}
            {badgeType && <div className="movie-card__badge">{badgeText}</div>}

            {/* Кнопка избранного */}
            <button
                className={`movie-card__favorite ${isFavorite ? "movie-card__favorite--active" : ""}`}
                onClick={handleFavoriteClick}
                aria-label={
                    isFavorite ? "Remove from favorites" : "Add to favorites"
                }
            >
                {isFavorite ? "♥" : "♡"}
            </button>

            {/* Контент карточки */}
            <div className="movie-card__content">
                <div className="movie-card__header">
                    <h3 className="movie-card__title">
                        {movie.title}
                        <span className="movie-card__year">
                            {" "}
                            ({movie.releaseYear})
                        </span>
                    </h3>
                    {movie.averageRating && (
                        <div className="movie-card__rating">
                            {movie.averageRating.toFixed(1)}
                        </div>
                    )}
                </div>

                {movie.description && (
                    <p className="movie-card__description">
                        {movie.description}
                    </p>
                )}

                {genres.length > 0 && (
                    <div className="movie-card__genres">
                        {genres.slice(0, 3).map((genre, idx) => (
                            <span key={idx} className="movie-card__genre">
                                {genre}
                            </span>
                        ))}
                        {genres.length > 3 && (
                            <span className="movie-card__genre">
                                +{genres.length - 3}
                            </span>
                        )}
                    </div>
                )}
            </div>
        </Link>
    );
}

export default MovieCard;
