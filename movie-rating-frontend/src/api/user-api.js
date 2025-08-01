
export const addUser = async (formData) => {
    const response = await fetch(`${process.env.REACT_APP_USER_SERVICE_URL}/users/add`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData)
    });
    if (!response.ok) {
        throw new Error('Failed to add new user');
    }
    return response.json();
}

export const getUser = async (id) => {
    const response = await fetch(`${process.env.REACT_APP_USER_SERVICE_URL}/users/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    });
    if (!response.ok) {
        throw new Error('Failed to get user');
    }
    return response.json();
}

export const getUserByUsername = async (username) => {
    const response = await fetch(`${process.env.REACT_APP_USER_SERVICE_URL}/users/username/${username}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    });
    if (!response.ok) {
        throw new Error('Failed to get user');
    }
    return response.json();
}

export const updateUsername = async (id, formData) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${process.env.REACT_APP_USER_SERVICE_URL}/users/edit/username/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Update username failed");
    }

    return response;
}

export const updateProfilePictureId = async (userId, fileId) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${process.env.REACT_APP_USER_SERVICE_URL}/users/profile-pic/${userId}?fileId=${fileId}`, {
        method: "PATCH",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to update the profile picture');
    }
    
    return response;
}

export const updateUserData = async (id, formData) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${process.env.REACT_APP_USER_SERVICE_URL}/users/edit/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
    });
    if (!response.ok) {
        throw new Error('Failed to update the user');
    }
    return response;
}

export const getTopUser = async () => {
    const response = await fetch(`${process.env.REACT_APP_USER_SERVICE_URL}/users/top-user`);
    if (!response.ok) {
        throw new Error('Failed to get top user');
    }
    return response.json();
}

export const getUsers = async () => {
    const response = await fetch(`${process.env.REACT_APP_USER_SERVICE_URL}/users`);
    if (!response.ok) {
        throw new Error('Failed to get users');
    }
    return response.json();
}

export const getUsersRatedMovie = async (movieId) => {
    const response = await fetch(`${process.env.REACT_APP_USER_SERVICE_URL}/users/movie/${movieId}`);
    if (!response.ok) {
        throw new Error(`Failed to get users that rated this movie: ${movieId}`);
    }
    return response.json();
}