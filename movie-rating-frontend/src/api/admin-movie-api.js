import customRequest from "./fetch-client";

export const addMovie = async (formData) => {
    try {
        const response = await customRequest(
            `${process.env.REACT_APP_MOVIE_SERVICE_URL}/admin/movies/add`,
            {
                method: "POST",
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
export const updateMovie = async (id, formData) => {
    try {
        const response = await customRequest(
            `${process.env.REACT_APP_MOVIE_SERVICE_URL}/admin/movies/edit/${id}`,
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
export const deleteMovie = async (id) => {
    try {
        const response = await customRequest(
            `${process.env.REACT_APP_MOVIE_SERVICE_URL}/admin/movies/delete/${id}`,
            {
                method: "DELETE"
            }
        );
        return await response.json();
    } catch (error) {
        throw error;
    }
};