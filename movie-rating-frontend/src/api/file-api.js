
export const downloadFile = async (filename) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${process.env.REACT_APP_USER_SERVICE_URL}/files/download/signed-url/${filename}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to get the file');
    }
    
    return response.text();
}
