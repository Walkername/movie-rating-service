
export const login = async (formData) => {
    const response = await fetch(`${process.env.REACT_APP_USER_SERVICE_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
    });
    if (!response.ok) {
        throw new Error('Failed to login');
    }
    return response.json();
}

export const register = async (formData) => {
    const response = await fetch(`${process.env.REACT_APP_USER_SERVICE_URL}/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Registration failed");
    }

    return response;
}