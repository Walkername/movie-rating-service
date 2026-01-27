import { useEffect, useState } from "react";
import { deleteRating, getRating, rateMovie } from "../../../api/rating-api";
import getClaimFromToken from "../../../utils/token-validation/token-validation";
import AuthPopup from "../../auth-popup/auth-popup";
import "./rate-movie.css";

function RateMovie({ movieId }) {
    const token = localStorage.getItem("accessToken");
    const userId = token ? getClaimFromToken(token, "id") : null;

    const [isModalOpen, setIsModalOpen] = useState(false);

    // CURRENT RATING
    const [rating, setRating] = useState(null);
    const [hoverRating, setHoverRating] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!userId) {
            setIsLoading(false);
            return;
        }

        getRating(userId, movieId)
            .then((data) => {
                setRating(data.rating);
            })
            .catch((error) => {
                console.error("Error fetching rating:", error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [userId, movieId]);

    // SEND RATING
    const handleSubmit = (rateValue) => {
        if (!token) {
            setIsModalOpen(true);
            return;
        }

        const formData = {
            movieId: movieId,
            rating: rateValue,
        };

        rateMovie(formData)
            .then((data) => {
                console.log("Rating updated successfully:", data);
                setRating(rateValue);
            })
            .catch((error) => {
                console.error("Error:", error);
                alert("Error updating rating");
            });
    };

    // DELETE RATING
    const handleDelete = () => {
        deleteRating(movieId)
            .then(() => {
                setRating(null);
            })
            .catch((error) => {
                console.error("Error deleting rating:", error);
                alert("Error deleting rating");
            });
    };

    // Функция для определения класса цвета по рейтингу
    const getStarColorClass = (starValue) => {
        if (starValue <= 3) return "rate-movie__star-button--low";
        if (starValue <= 6) return "rate-movie__star-button--medium";
        if (starValue <= 8) return "rate-movie__star-button--high";
        return "rate-movie__star-button--excellent";
    };

    // Текущее отображаемое значение (hover или фактическое)
    const currentDisplayRating = hoverRating || rating;

    // Определяем цвет текущего рейтинга для текста
    const getRatingColor = () => {
        if (!currentDisplayRating) return "var(--color-text-light)";
        if (currentDisplayRating <= 3) return "var(--color-error)";
        if (currentDisplayRating <= 6) return "var(--color-warning)";
        if (currentDisplayRating <= 8) return "var(--color-success)";
        return "var(--color-accent)";
    };

    if (isLoading) {
        return (
            <div className="rate-movie">
                <div className="rate-movie__loading">
                    <div className="rate-movie__spinner"></div>
                    <p>Loading rating...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="rate-movie">
            {isModalOpen && <AuthPopup setIsModalOpen={setIsModalOpen} />}

            <div className="rate-movie__header">
                <h3 className="rate-movie__title">Rate This Movie</h3>
                <p className="rate-movie__subtitle">
                    Click on a star to rate from 1 to 10
                </p>
            </div>

            <div className="rate-movie__stars">
                {[...Array(10)].map((_, index) => {
                    const rateValue = index + 1;
                    const isCurrent = rateValue === rating;
                    const colorClass = getStarColorClass(rateValue);

                    return (
                        <button
                            key={rateValue}
                            className={`rate-movie__star-button ${colorClass} ${
                                isCurrent
                                    ? "rate-movie__star-button--current"
                                    : ""
                            }`}
                            onClick={() => handleSubmit(rateValue)}
                            onMouseEnter={() => setHoverRating(rateValue)}
                            onMouseLeave={() => setHoverRating(0)}
                            aria-label={`Rate ${rateValue} out of 10`}
                            disabled={!token}
                        >
                            <span className="rate-movie__star-number">
                                {rateValue}
                            </span>
                            <svg
                                className="rate-movie__star-icon"
                                viewBox="0 0 24 24"
                            >
                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                            </svg>
                        </button>
                    );
                })}
            </div>

            <div className="rate-movie__info">
                {rating ? (
                    <div className="rate-movie__current-rating">
                        <span className="rate-movie__rating-text">
                            Your rating:
                        </span>
                        <span
                            className="rate-movie__rating-value"
                            style={{ color: getRatingColor() }}
                        >
                            {rating}/10
                        </span>
                        <button
                            className="rate-movie__delete-button"
                            onClick={handleDelete}
                            aria-label="Delete rating"
                        >
                            <svg
                                className="rate-movie__delete-icon"
                                viewBox="0 0 24 24"
                            >
                                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                            </svg>
                            Remove
                        </button>
                    </div>
                ) : (
                    <div className="rate-movie__no-rating">
                        <svg
                            className="rate-movie__no-rating-icon"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z" />
                        </svg>
                        <span>Not rated yet</span>
                    </div>
                )}
            </div>

            <div className="rate-movie__legend">
                <div className="rate-movie__legend-item">
                    <div className="rate-movie__legend-color rate-movie__legend-color--low"></div>
                    <span>Poor (1-3)</span>
                </div>
                <div className="rate-movie__legend-item">
                    <div className="rate-movie__legend-color rate-movie__legend-color--medium"></div>
                    <span>Average (4-6)</span>
                </div>
                <div className="rate-movie__legend-item">
                    <div className="rate-movie__legend-color rate-movie__legend-color--high"></div>
                    <span>Good (7-8)</span>
                </div>
                <div className="rate-movie__legend-item">
                    <div className="rate-movie__legend-color rate-movie__legend-color--excellent"></div>
                    <span>Excellent (9-10)</span>
                </div>
            </div>
        </div>
    );
}

export default RateMovie;
