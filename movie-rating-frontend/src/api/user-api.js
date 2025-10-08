import customRequest from "./fetch-client";

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

export const updateMyUsername = async (formData) => {
    try {
        const response = await customRequest(
            `${process.env.REACT_APP_USER_SERVICE_URL}/users/me/username`,
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

export const updateMyProfilePictureId = async (fileId) => {
    try {
        const response = await customRequest(
            `${process.env.REACT_APP_USER_SERVICE_URL}/users/me/profile-pic?fileId=${fileId}`,
            {
                method: "PATCH"
            }
        );
        return response;
    } catch (error) {
        throw error;
    }
};

export const updateMyUserData = async (formData) => {
    try {
        const response = await customRequest(`${process.env.REACT_APP_USER_SERVICE_URL}/users/me`,
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

