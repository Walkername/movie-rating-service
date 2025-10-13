import { useEffect, useState } from "react";
import { addRating, deleteRating, getRating, updateRating } from "../../../api/rating-api";
import getClaimFromToken from "../../../utils/token-validation/token-validation";
import AuthPopup from "../../auth-popup/auth-popup";
import "./rate-movie.css";

function RateMovie({ movieId }) {
    const token = localStorage.getItem("accessToken");
    const userId = getClaimFromToken(token, "id");

    const [isModalOpen, setIsModalOpen] = useState(false);

    // CURRENT RATING
    const [rating, setRating] = useState(null);
    const [hoverRating, setHoverRating] = useState(0);

    useEffect(() => {
        getRating(userId, movieId)
            .then((data) => {
                setRating(data.rating);
            })
            .catch((error) => {
                console.error("Error:", error);
            })
    }, [userId, movieId]);

    // SEND RATING
    const handleSubmit = (rateValue) => {
        if (token == null) {
            setIsModalOpen(true);
            return;
        }

        const formData = {
            movieId: movieId,
            rating: rateValue
        }

        if (rating != null) {
            updateRating(formData)
                .then((data) => {
                    console.log("Rating updated successfully:", data);
                    setRating(rateValue);
                })
                .catch((error) => {
                    console.error("Error:", error);
                    alert("Error updated rating");
                })
        } else {
            addRating(formData)
                .then((data) => {
                    console.log("Rating added successfully:", data);
                    setRating(rateValue);
                })
                .catch((error) => {
                    console.error("Error:", error);
                    alert("Error adding rating");
                });
        }
    };

    // DELETE RATING
    const handleDelete = () => {
        deleteRating(movieId)
            .then(() => {
                setRating(null);
            });
    };

    // Функция для определения цвета по рейтингу
    const getRatingColor = (rateValue) => {
        if (rateValue <= 4) return 'red';
        if (rateValue <= 6) return 'gray';
        if (rateValue <= 8) return 'green';
        return 'gold';
    };

    const currentDisplayRating = hoverRating || rating;
    const currentColor = currentDisplayRating ? getRatingColor(currentDisplayRating) : null;

    return (
        <div className="rate-movie-container">
            {isModalOpen && <AuthPopup setIsModalOpen={setIsModalOpen} />}
            
            <div className="rating-section">
                <h3 className="rating-title">Rate this movie</h3>
                
                <div className={`rating-stars ${currentColor ? `color-${currentColor}` : ''}`}>
                    {[...Array(10)].map((_, index) => {
                        const rateValue = index + 1;
                        const isActive = currentDisplayRating && rateValue <= currentDisplayRating;
                        const isCurrent = rateValue === rating;
                        
                        return (
                            <button
                                key={rateValue}
                                className={`star-button ${
                                    isActive ? 'active' : ''
                                } ${isCurrent ? 'current-rating' : ''}`}
                                onClick={() => handleSubmit(rateValue)}
                                onMouseEnter={() => setHoverRating(rateValue)}
                                onMouseLeave={() => setHoverRating(0)}
                                aria-label={`Rate ${rateValue} out of 10`}
                            >
                                <span className="star-number">{rateValue}</span>
                                <svg 
                                    className="star-icon" 
                                    viewBox="0 0 24 24" 
                                    fill="currentColor"
                                >
                                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                                </svg>
                            </button>
                        );
                    })}
                </div>

                <div className="rating-info">
                    {rating ? (
                        <div className={`current-rating-display color-${getRatingColor(rating)}`}>
                            <span className="rating-text">Your rating: </span>
                            <span className="rating-value">{rating}/10</span>
                            <button 
                                className="delete-rating-button"
                                onClick={handleDelete}
                                aria-label="Delete rating"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                                </svg>
                                Remove
                            </button>
                        </div>
                    ) : (
                        <div className="no-rating">
                            <span className="rating-text">Not rated yet</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default RateMovie;