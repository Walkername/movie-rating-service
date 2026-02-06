import customRequest from "./fetch-client";

export const createSupportChat = async () => {
    try {
        const response = await customRequest(
            `${process.env.REACT_APP_CONVERSATION_SERVICE_URL}/support-chats`,
            {
                method: "POST",
            },
        );
        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const getSupportChat = async () => {
    try {
        const response = await customRequest(
            `${process.env.REACT_APP_CONVERSATION_SERVICE_URL}/support-chats`,
            {
                method: "GET",
            },
        );
        return await response.json();
    } catch (error) {
        throw error;
    }
};