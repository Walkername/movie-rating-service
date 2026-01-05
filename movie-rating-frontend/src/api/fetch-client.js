import getClaimFromToken from "../utils/token-validation/token-validation";

export default async function customRequest(path, options = {}) {
    // Adding authorization token
    const requestOptions = { ...options };
    requestOptions.headers = requestOptions.headers || {};

    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    const expRefreshToken = refreshToken ? getClaimFromToken(refreshToken, "exp") : null;
    if (Date.now() / 1000 > expRefreshToken) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
    }

    if (accessToken) {
        requestOptions.headers.Authorization = `Bearer ${accessToken}`;
    }

    let response = await fetch(path, requestOptions);
    
    // If 401 status code, then use refresh and the same rawBody
    if (response.status === 401) {
        const refreshRes = await fetch(
            process.env.REACT_APP_USER_SERVICE_URL + "/auth/refresh",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ refreshToken: localStorage.getItem("refreshToken") })
            }
        );
        if (!refreshRes.ok) throw new Error("Session expired");

        const { accessToken, refreshToken } = await refreshRes.json();
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        // Updating authorization header
        const retryOptions = {
            ...requestOptions,
            headers: {
                ...requestOptions.headers,
                Authorization: `Bearer ${accessToken}`
            }
        };

        // Repeating initial request
        response = await fetch(path, retryOptions);
    }

    if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        throw new Error(errBody.message || response.statusText);
    }

    return response;
};
