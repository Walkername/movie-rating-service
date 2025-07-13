import { useEffect, useState } from "react";
import { addRating, getRating, updateRating } from "../../api/rating-api";
import getClaimFromToken from "../../utils/token-validation/token-validation";
import AuthPopup from "../auth-popup/auth-popup";

function RateMovie({ movieId }) {
    const token = localStorage.getItem("token");
    const userId = getClaimFromToken(token, "id");

    const [isModalOpen, setIsModalOpen] = useState(false);

    // CURRENT RATING
    const [ratingInfo, setRatingInfo] = useState(null);
    const [rating, setRating] = useState(null);

    useEffect(() => {
        getRating(userId, movieId)
            .then((data) => {
                console.log("Rating got successfully:", data);
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
            userId: userId,
            movieId: movieId,
            rating: rateValue
        }

        if (rating != null) {
            const ratingId = ratingInfo.ratingId;
            updateRating(ratingId, formData)
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
            </div>
        </div>
    )
}

export default RateMovie;