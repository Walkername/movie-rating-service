import { useEffect, useState } from "react";
import { addRating, deleteRating, getRating, updateRating } from "../../../api/rating-api";
import getClaimFromToken from "../../../utils/token-validation/token-validation";
import AuthPopup from "../../auth-popup/auth-popup";

function RateMovie({ movieId }) {
    const token = localStorage.getItem("accessToken");
    const userId = getClaimFromToken(token, "id");

    const [isModalOpen, setIsModalOpen] = useState(false);

    // CURRENT RATING
    const [ratingInfo, setRatingInfo] = useState(null);
    const [rating, setRating] = useState(null);

    useEffect(() => {
        getRating(userId, movieId)
            .then((data) => {
                setRatingInfo(data);
                setRating(data.rating);
            })
            .catch((error) => {
                console.error("Error:", error);
            })
    }, [movieId, userId, rating]);

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

    return (
        <div>
            {/* Модальное окно */}
            {isModalOpen && <AuthPopup setIsModalOpen={setIsModalOpen} />}
            <div>
                {
                    [...Array(10)].map((_, index) => {
                        const rateValue = index + 1;
                        return (
                            <button
                                key={rateValue}
                                onClick={() => handleSubmit(rateValue)}
                                style={{
                                    margin: '5px',
                                    fontSize: '16px',
                                    backgroundColor: rateValue === rating ? '#4CAF50' : '#f1f1f1',
                                    color: rateValue === rating ? 'white' : 'black',
                                    borderRadius: '10px',
                                    cursor: 'pointer',
                                }}
                            >
                                {rateValue}
                            </button>
                        );
                    })
                }
                {
                    rating && (
                        <span
                            className="delete-rating-button"
                            onClick={handleDelete}
                        >
                            Delete Rating
                        </span>
                    )
                }
            </div>
        </div>
    )
}

export default RateMovie;