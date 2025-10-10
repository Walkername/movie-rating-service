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

export const downloadFiles = async (entityType, entityId, page = 0, limit = 10, sort = "uploadedAt:desc") => {
    try {
        const response = await customRequest(
            `${process.env.REACT_APP_FILE_SERVICE_URL}/files/download-all/signed-url?entityType=${entityType}&entityId=${entityId}&page=${page}&limit=${limit}&sort=${sort}`
        );
        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const uploadMyFile = async (formData, context) => {
    try {
        const response = await customRequest(
            `${process.env.REACT_APP_FILE_SERVICE_URL}/files/upload?context=${context}`,
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

