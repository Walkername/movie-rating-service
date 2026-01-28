import { useState, useEffect } from "react";

export const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return !!localStorage.getItem("accessToken");
    });

    useEffect(() => {
        const checkAuth = () => {
            setIsAuthenticated(!!localStorage.getItem("accessToken"));
        };

        // Проверяем при монтировании
        checkAuth();

        // Слушаем кастомные события изменения авторизации
        const handleAuthChange = () => checkAuth();

        // Слушаем изменения localStorage из других вкладок
        const handleStorageChange = (e) => {
            if (e.key === "accessToken") checkAuth();
        };

        window.addEventListener("authChange", handleAuthChange);
        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("authChange", handleAuthChange);
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    return isAuthenticated;
};
