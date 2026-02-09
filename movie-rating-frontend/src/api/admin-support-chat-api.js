import customRequest from "./fetch-client";

export const getAdminSupportChats = async () => {
    try {
        const response = await customRequest(
            `${process.env.REACT_APP_CONVERSATION_SERVICE_URL}/admin/support-chats`,
            {
                method: "GET",
            },
        );
        return await response.json();
    } catch (error) {
        throw error;
    }
};