export const getMoviesByUser = async (id, page, limit, sort, minRating) => {
    try {
        const response = await fetch(
            `${process.env.REACT_APP_USER_LIBRARY_URL}/user-movies/${id}?page=${page}&limit=${limit}&sort=${sort}`,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );
        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const searchUserMoviesByTitle = async (id, query) => {
    try {
        const response = await fetch(
            `${process.env.REACT_APP_USER_LIBRARY_URL}/user-movies/${id}/search?query=${query}`,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );
        return await response.json();
    } catch (error) {
        throw error;
    }
};
