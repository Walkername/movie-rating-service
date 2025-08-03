import customRequest from "./fetch-client";

export const addMovie = async (formData) => {
    try {
        const response = await customRequest(
            `${process.env.REACT_APP_MOVIE_SERVICE_URL}/movies/add`,
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
            `${process.env.REACT_APP_MOVIE_SERVICE_URL}/movies/edit/${id}`,
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

export const getMoviesWithPagination = async (page, limit, sort) => {
    try {
        const response = await customRequest(
            `${process.env.REACT_APP_MOVIE_SERVICE_URL}/movies?page=${page}&limit=${limit}&down=${sort}`
        );
        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const getMoviesNumber = async () => {
    try {
        const response = await customRequest(`${process.env.REACT_APP_MOVIE_SERVICE_URL}/movies/count`);
        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const getMovie = async (id) => {
    try {
        const response = await customRequest(`${process.env.REACT_APP_MOVIE_SERVICE_URL}/movies/${id}`);
        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const deleteMovie = async (id) => {
    try {
        const response = await customRequest(
            `${process.env.REACT_APP_MOVIE_SERVICE_URL}/movies/delete/${id}`,
            {
                method: "DELETE"
            }
        );
        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const getMoviesByUser = async (id, page, limit, sort) => {
    try {
        const response = await customRequest(
            `${process.env.REACT_APP_MOVIE_SERVICE_URL}/movies/user/${id}?page=${page}&limit=${limit}&byDate=${sort}`
        );
        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const searchMovieByTitle = async (query) => {
    try {
        const response = await customRequest(
            `${process.env.REACT_APP_MOVIE_SERVICE_URL}/movies/search?query=${query}`
        );
        return await response.json();
    } catch (error) {
        throw error;
    }
};
