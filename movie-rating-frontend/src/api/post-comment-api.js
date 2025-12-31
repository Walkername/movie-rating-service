import customRequest from "./fetch-client";

export const getAllCommentsForPost = async (postId) => {
    try {
        const response = await customRequest(
            `${process.env.REACT_APP_FEED_SERVICE_URL}/posts/${postId}/comments`
        );
        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const publishComment = async (postId, comment) => {
    try {
        const response = await customRequest(
            `${process.env.REACT_APP_FEED_SERVICE_URL}/posts/${postId}/comments`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(comment)
            }
        );
        return await response.json();
    } catch (error) {
        throw error;
    }
};