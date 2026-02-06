import customRequest from "./fetch-client";

export const sendMessageToChat = async (chatId, formData) => {
    try {
        const response = await customRequest(
            `${process.env.REACT_APP_CONVERSATION_SERVICE_URL}/chats/${chatId}/messages`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            },
        );
        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const getMessagesFromChat = async (chatId) => {
    try {
        const response = await customRequest(
            `${process.env.REACT_APP_CONVERSATION_SERVICE_URL}/chats/${chatId}/messages`,
            {
                method: "GET",
            },
        );
        return await response.json();
    } catch (error) {
        throw error;
    }
};