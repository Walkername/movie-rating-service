import { useEffect, useState } from "react";
import { getUsersRatedMovie } from "../../api/user-api";
import { addRating, getRating, updateRating } from "../../api/rating-api";
import getClaimFromToken from "../../utils/token-validation/token-validation";
import AuthPopup from "../auth-popup/auth-popup";

function RateMovie({ movieId, isAccessToEdit }) {
    const token = localStorage.getItem("token");
    const userId = getClaimFromToken(token, "id");

    const [isModalOpen, setIsModalOpen] = useState(false);

    // CURRENT RATING
    const [rating, setRating] = useState(null);

    useEffect(() => {
        getRating(userId, movieId)
            .then((data) => {
                console.log("Rating got successfully:", data);
                setRating(data.rating);
            })
            .catch((error) => {
                console.error("Error:", error);
            })
    }, [movieId, userId]);

    // SEND RATING
    const handleSubmit = (rateValue) => {
        if (!isAccessToEdit) {
            setIsModalOpen(true);
            return;
        }

        setRating(rateValue);

        const formData = {
            userId: userId,
            movieId: movieId,
            rating: rateValue
        }

        if (usersR.some(user => user.userId === parseInt(formData.userId))) {
            const ratingId = usersR.find(user => user.userId === parseInt(formData.userId)).ratingId;
            updateRating(ratingId, formData)
                .then((data) => {
                    console.log("Rating updated successfully:", data);
                })
                .catch((error) => {
                    console.error("Error:", error);
                    alert("Error updated rating");
                })
        } else {
            addRating(formData)
                .then((data) => {
                    console.log("Rating added successfully:", data);
                })
                .catch((error) => {
                    console.error("Error:", error);
                    alert("Error adding rating");
                });
        }
    };

    // ALL USERS THAT RATED THIS MOVIE
    const [usersR, setUsersR] = useState([]); // State for the movie data

    useEffect(() => {
        getUsersRatedMovie(movieId)
            .then((data) => {
                setUsersR(data); // Set the movie data
            })
            .catch((error) => {
                console.error(error);
            });
    }, [movieId]);

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

            <h3>Users that rated the movie:</h3>
            {
                usersR.map((user, index) => {
                    return (
                        <div key={index}>{user.username} : {user.rating}</div>
                    )
                })
            }
        </div>
    )
}

export default RateMovie;