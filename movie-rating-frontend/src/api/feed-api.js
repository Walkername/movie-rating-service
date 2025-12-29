import customRequest from "./fetch-client";

export const getPosts = async (page, limit) => {
    try {
        const response = await customRequest(
            `${process.env.REACT_APP_FEED_SERVICE_URL}/posts?page=${page}&limit=${limit}`
        );
        return await response.json();
    } catch (error) {
        throw error;
    }
};
