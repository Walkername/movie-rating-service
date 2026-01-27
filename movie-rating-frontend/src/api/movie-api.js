import customRequest from "./fetch-client";

export const getMoviesWithPagination = async (page, limit, sort) => {
    try {
        const response = await customRequest(
            `${process.env.REACT_APP_MOVIE_SERVICE_URL}/movies?page=${page}&limit=${limit}&sort=${sort}`,
        );
        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const getMovie = async (id) => {
    try {
        const response = await customRequest(
            `${process.env.REACT_APP_MOVIE_SERVICE_URL}/movies/${id}`,
        );
        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const getMoviesByUser = async (id, page, limit, sort) => {
    try {
        const response = await customRequest(
            `${process.env.REACT_APP_MOVIE_SERVICE_URL}/movies/user/${id}?page=${page}&limit=${limit}&sort=${sort}`,
        );
        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const searchMovieByTitle = async (query) => {
    try {
        const response = await customRequest(
            `${process.env.REACT_APP_MOVIE_SERVICE_URL}/movies/search?query=${query}`,
        );
        return await response.json();
    } catch (error) {
        throw error;
    }
};
