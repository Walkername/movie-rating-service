
export const addMovie = async (formData) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${process.env.REACT_APP_MOVIE_SERVICE_URL}/movies/add`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify(formData)
    });
    if (!response.ok) {
        throw new Error('Failed to add new movie');
    }
    return response.json();
}

export const updateMovie = async (id, formData) => {
    const response = await fetch(`${process.env.REACT_APP_MOVIE_SERVICE_URL}/movies/edit/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData)
    });
    if (!response.ok) {
        throw new Error('Failed to update the movie');
    }
    return response.json();
}

export const getMoviesWithPagination = async (page, limit, sort) => {
    const response = await fetch(`${process.env.REACT_APP_MOVIE_SERVICE_URL}/movies?page=${page}&limit=${limit}&down=${sort}`);
    if (!response.ok) {
        throw new Error('Failed to get movies with pagination');
    }
    return response.json();
}

export const getMoviesNumber = async () => {
    const response = await fetch(`${process.env.REACT_APP_MOVIE_SERVICE_URL}/movies/count`);
    if (!response.ok) {
        throw new Error('Failed to get number of movies');
    }
    return response.json();
}

export const getMovie = async (id) => {
    const response = await fetch(`${process.env.REACT_APP_MOVIE_SERVICE_URL}/movies/${id}`);
    if (!response.ok) {
        throw new Error(`Failed to get movie with this id:${id}`);
    }
    return response.json();
}

export const deleteMovie = async (id) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${process.env.REACT_APP_MOVIE_SERVICE_URL}/movies/delete/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
    if (!response.ok) {
        throw new Error(`Failed to delete movie with this id:${id}`);
    }
    return response.json();
}

export const getMoviesByUser = async (id, page, limit, sort) => {
    const response = await fetch(`${process.env.REACT_APP_MOVIE_SERVICE_URL}/movies/user/${id}?page=${page}&limit=${limit}&byDate=${sort}`, {
        method: "GET",
    });
    if (!response.ok) {
        throw new Error(`Failed to get movies by this user_id:${id}`);
    }
    return response.json();
}

export const searchMovieByTitle = async (query) => {
    const response = await fetch(`${process.env.REACT_APP_MOVIE_SERVICE_URL}/movies/search?query=${query}`, {
        method: "GET",
    });
    if (!response.ok) {
        throw new Error(`Failed to get movies by this query: ${query}`);
    }
    return response.json();
}

