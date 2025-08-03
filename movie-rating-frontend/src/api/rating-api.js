import customRequest from "./fetch-client";

export const addRating = async (formData) => {
    try {
        const response = await customRequest(
            `${process.env.REACT_APP_RATING_SERVICE_URL}/ratings/add`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData),
            }
        );
        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const updateRating = async (ratingId, formData) => {
    try {
        const response = await customRequest(
            `${process.env.REACT_APP_RATING_SERVICE_URL}/ratings/edit/${ratingId}`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            }
        );
        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const getRating = async (userId, movieId) => {
    try {
        const response = await fetch(
            `${process.env.REACT_APP_RATING_SERVICE_URL}/ratings/${userId}/${movieId}`,
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
        return await response.json();
    } catch (error) {
        throw error;
    }
};