import customRequest from "./fetch-client";

export const getNotifications = async () => {
    try {
        const response = await customRequest(
            `${process.env.REACT_APP_NOTIFICATION_SERVICE_URL}/notifications`,
        );
        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const markNotificationAsRead = async (id) => {
    try {
        const response = await customRequest(
            `${process.env.REACT_APP_NOTIFICATION_SERVICE_URL}/notifications/${id}/read`,
            {
                method: "PATCH",
            },
        );
        return response;
    } catch (error) {
        throw error;
    }
};

export const markNotificationsAsBatchRead = async (ids) => {
    try {
        const response = await customRequest(
            `${process.env.REACT_APP_NOTIFICATION_SERVICE_URL}/notifications/batch-read`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(ids),
            },
        );
        return response;
    } catch (error) {
        throw error;
    }
};
