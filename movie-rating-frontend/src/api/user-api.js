import customRequest from "./fetch-client";

export const addUser = async (formData) => {
    try {
        const response = await customRequest(
            `${process.env.REACT_APP_USER_SERVICE_URL}/users/add`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData)
            }
        );
        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const getUser = async (id) => {
    try {
        const response = await customRequest(
            `${process.env.REACT_APP_USER_SERVICE_URL}/users/${id}`,
            {
                headers: {
                    "Content-Type": "application/json",
                }
            }
        );
        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const getUserByUsername = async (username) => {
    try {
        const response = await customRequest(`${process.env.REACT_APP_USER_SERVICE_URL}/users/username/${username}`,
            {
                headers: {
                    "Content-Type": "application/json",
                }
            }
        );
        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const updateUsername = async (id, formData) => {
    try {
        const response = await customRequest(
            `${process.env.REACT_APP_USER_SERVICE_URL}/users/edit/username/${id}`,
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
        throw new Error(error.message || "Update username failed");
    }
};

export const updateProfilePictureId = async (userId, fileId) => {
    try {
        const response = await customRequest(
            `${process.env.REACT_APP_USER_SERVICE_URL}/users/profile-pic/${userId}?fileId=${fileId}`,
            {
                method: "PATCH"
            }
        );
        return response;
    } catch (error) {
        throw error;
    }
};

export const updateUserData = async (id, formData) => {
    try {
        const response = await customRequest(`${process.env.REACT_APP_USER_SERVICE_URL}/users/edit/${id}`,
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

export const getTopUser = async () => {
    try {
        const response = await customRequest(`${process.env.REACT_APP_USER_SERVICE_URL}/users/top-user`);
        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const getUsers = async () => {
    try {
        const response = await customRequest(`${process.env.REACT_APP_USER_SERVICE_URL}/users`);
        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const getUsersRatedMovie = async (movieId) => {
    try {
        const response = await customRequest(`${process.env.REACT_APP_USER_SERVICE_URL}/users/movie/${movieId}`);
        return await response.json();
    } catch (error) {
        throw error;
    }
};