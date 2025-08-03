import customRequest from "./fetch-client";

export const login = async (formData) => {
    try {
        const response = await customRequest(`${process.env.REACT_APP_USER_SERVICE_URL}/auth/login`,
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

export const register = async (formData) => {
    try {
        const response = await customRequest(`${process.env.REACT_APP_USER_SERVICE_URL}/auth/register`,
            {
                method: "POST",
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