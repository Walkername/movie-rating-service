import customRequest from "./fetch-client";

export const addRating = async (formData) => {
    try {
        const response = await customRequest(
            `${process.env.REACT_APP_RATING_SERVICE_URL}/ratings`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData),
            }
        );
        return response;
    } catch (error) {
        throw error;
    }
};

export const updateRating = async (formData) => {
    try {
        const response = await customRequest(
            `${process.env.REACT_APP_RATING_SERVICE_URL}/ratings`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            }
        );
        return response;
    } catch (error) {
        throw error;
    }
};

export const deleteRating = async (movieId) => {
    try {
        const response = await customRequest(
            `${process.env.REACT_APP_RATING_SERVICE_URL}/ratings/${movieId}`,
            {
                method: "DELETE"
            }
        );
        return response;
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