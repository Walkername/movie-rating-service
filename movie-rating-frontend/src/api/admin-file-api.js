import customRequest from "./fetch-client";

export const uploadFile = async (formData, context, entityId) => {
    try {
        const response = await customRequest(
            `${process.env.REACT_APP_FILE_SERVICE_URL}/admin/files/upload?context=${context}&id=${entityId}`,
            {
                method: "POST",
                body: formData,
            },
        );
        return await response.text();
    } catch (error) {
        throw error;
    }
};
