import customRequest from "./fetch-client";

export const updateUserData = async (userId, formData) => {
    try {
        const response = await customRequest(
            `${process.env.REACT_APP_USER_SERVICE_URL}/admin/users/${userId}`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            },
        );
        return response;
    } catch (error) {
        throw error;
    }
};

export const updateUsername = async (userId, formData) => {
    try {
        const response = await customRequest(
            `${process.env.REACT_APP_USER_SERVICE_URL}/admin/users/${userId}/username`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            },
        );
        return response;
    } catch (error) {
        throw new Error(error.message || "Update username failed");
    }
};

export const updateProfilePictureId = async (userId, fileId) => {
    try {
        const response = await customRequest(
            `${process.env.REACT_APP_USER_SERVICE_URL}/admin/users/${userId}/profile-pic?fileId=${fileId}`,
            {
                method: "PATCH",
            },
        );
        return response;
    } catch (error) {
        throw error;
    }
};
