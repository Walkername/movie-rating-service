
export const addRating = async (formData) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${process.env.REACT_APP_RATING_SERVICE_URL}/ratings/add`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData),
    });
    if (!response.ok) {
        throw new Error('Failed to add new rating the movie');
    }
    return response.json();
}

export const updateRating = async (ratingId, formData) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${process.env.REACT_APP_RATING_SERVICE_URL}/ratings/edit/${ratingId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
    });
    if (!response.ok) {
        throw new Error('Failed to update the rating of the movie');
    }
    return response.json();
}

export const getRating = async (userId, movieId) => {
    const response = await fetch(`${process.env.REACT_APP_RATING_SERVICE_URL}/ratings/${userId}/${movieId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });
    if (!response.ok) {
        throw new Error('Failed to get the rating of the movie');
    }
    return response.json();
}