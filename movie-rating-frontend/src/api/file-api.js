
export const downloadFile = async (fileId) => {
    const response = await fetch(`${process.env.REACT_APP_FILE_SERVICE_URL}/files/download-by-id/signed-url/${fileId}`, {
        method: "GET"
    });

    if (!response.ok) {
        throw new Error('Failed to get the file');
    }
    
    return response.text();
}

export const uploadFile = async (formData, context, contextId) => {
    const token = localStorage.getItem("accessToken");
    const response = await fetch(`${process.env.REACT_APP_FILE_SERVICE_URL}/files/upload?context=${context}&id=${contextId}`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`
        },
        body: formData
    });

    if (!response.ok) {
        throw new Error('Failed to get the file');
    }
    
    return response.text();
}
