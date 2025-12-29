import customRequest from "./fetch-client";

export const createPost = async (post) => {
    try {
        const response = await customRequest(
            `${process.env.REACT_APP_FEED_SERVICE_URL}/admin/posts`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(post)
            }
        );
        return await response.json();
    } catch (error) {
        throw error;
    }
};