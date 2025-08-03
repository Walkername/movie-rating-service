import customRequest from "./fetch-client";

export const downloadFile = async (fileId) => {
    try {
        const response = await customRequest(
            `${process.env.REACT_APP_FILE_SERVICE_URL}/files/download-by-id/signed-url/${fileId}`
        );
        return await response.text();
    } catch (error) {
        throw error;
    }
};

export const uploadFile = async (formData, context, contextId) => {
    try {
        const response = await customRequest(
            `${process.env.REACT_APP_FILE_SERVICE_URL}/files/upload?context=${context}&id=${contextId}`,
            {
                method: "POST",
                body: formData
            }
        );
        return await response.text();
    } catch (error) {
        throw error;
    }
};
