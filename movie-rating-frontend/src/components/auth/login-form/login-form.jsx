import { useState } from "react";
import { login } from "../../../api/auth-api";
import { useNavigate, useLocation } from "react-router-dom";
import getClaimFromToken from "../../../utils/token-validation/token-validation";
import "./login-form.css";
import "../shared/auth-form.css"; // Импортируем общие стили

export default function LoginForm() {
    const navigate = useNavigate();
    const location = useLocation();
    
    const [errorMessages, setErrorMessages] = useState([]);
    const [fieldErrors, setFieldErrors] = useState({
        username: "",
        password: ""
    });

    const [formData, setFormData] = useState({
        username: "",
        password: "",
        rememberMe: false
    });

    const [isLoading, setIsLoading] = useState(false);

    // Проверка, пришли ли с регистрации
    const isFromRegister = location.state?.fromRegister || false;

    const validateField = (name, value) => {
        switch (name) {
            case "username":
                if (value.length < 5) return "Username must be at least 5 characters";
                if (value.length > 20) return "Username must be less than 20 characters";
                if (!/^[a-zA-Z0-9_]+$/.test(value)) return "Only letters, numbers and underscore";
                return "";
            case "password":
                if (value.length < 5) return "Password must be at least 5 characters";
                return "";
            default:
                return "";
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        const fieldValue = type === 'checkbox' ? checked : value;
        
        // Валидация в реальном времени
        if (name !== 'rememberMe') {
            const error = validateField(name, fieldValue);
            setFieldErrors(prev => ({
                ...prev,
                [name]: error
            }));
        }

        setFormData(prev => ({ ...prev, [name]: fieldValue }));
    };

    const validateForm = () => {
        const errors = {};
        let isValid = true;

        errors.username = validateField("username", formData.username);
        if (errors.username) isValid = false;

        errors.password = validateField("password", formData.password);
        if (errors.password) isValid = false;

        setFieldErrors(errors);
        return isValid;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) {
            setErrorMessages(["Please fix the errors above"]);
            return;
        }

        setErrorMessages([]);
        setIsLoading(true);

        login(formData)
            .then((data) => {
                console.log("Login successful");
                localStorage.setItem("accessToken", data.accessToken);
                localStorage.setItem("refreshToken", data.refreshToken);
                
                // Опционально: сохранить в localStorage если rememberMe
                if (formData.rememberMe) {
                    localStorage.setItem("rememberedUsername", formData.username);
                }
                
                const id = getClaimFromToken(data.accessToken, "id");
                navigate(`/user/${id}`);
            })
            .catch((error) => {
                console.error("Login error:", error);
                setErrorMessages(["Invalid username or password"]);
                // Анимация ошибки
                const inputs = document.querySelectorAll('.auth-form__input');
                inputs.forEach(input => {
                    input.classList.add('auth-form__input--error');
                    setTimeout(() => {
                        input.classList.remove('auth-form__input--error');
                    }, 500);
                });
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    // Заполнить сохраненный username при монтировании
    useState(() => {
        const rememberedUsername = localStorage.getItem("rememberedUsername");
        if (rememberedUsername) {
            setFormData(prev => ({ ...prev, username: rememberedUsername, rememberMe: true }));
        }
    }, []);

    const isFormValid = !fieldErrors.username && !fieldErrors.password && 
                       formData.username && formData.password;

    return (
        <div className="auth-form">
            {isFromRegister && (
                <div className="login-form__success-message">
                    <div className="login-form__success-text">
                        Registration successful! Please log in.
                    </div>
                </div>
            )}
            
            <form className="auth-form__form" onSubmit={handleSubmit} noValidate>
                <div className="auth-form__field">
                    <label className="auth-form__label" htmlFor="username">
                        Username
                    </label>
                    <input
                        className={`auth-form__input ${fieldErrors.username ? 'auth-form__input--error' : ''}`}
                        id="username"
                        name="username"
                        type="text"
                        minLength="5"
                        maxLength="20"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        placeholder="Enter your username"
                    />
                    {fieldErrors.username && (
                        <span className="auth-form__error">{fieldErrors.username}</span>
                    )}
                </div>

                <div className="auth-form__field">
                    <label className="auth-form__label" htmlFor="password">
                        Password
                    </label>
                    <input
                        className={`auth-form__input ${fieldErrors.password ? 'auth-form__input--error' : ''}`}
                        id="password"
                        name="password"
                        type="password"
                        minLength="5"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        placeholder="Enter your password"
                    />
                    {fieldErrors.password && (
                        <span className="auth-form__error">{fieldErrors.password}</span>
                    )}
                </div>

                <div className="login-form__remember">
                    <input
                        className="login-form__remember-checkbox"
                        id="rememberMe"
                        name="rememberMe"
                        type="checkbox"
                        checked={formData.rememberMe}
                        onChange={handleChange}
                    />
                    <label className="login-form__remember-label" htmlFor="rememberMe">
                        Remember me
                    </label>
                </div>

                <button
                    className={`auth-form__submit login-form__submit ${isLoading ? 'auth-form__submit--loading' : ''}`}
                    type="submit"
                    disabled={!isFormValid || isLoading}
                >
                    {isLoading ? 'Signing in...' : 'Sign In'}
                </button>
            </form>
            
            {errorMessages.length > 0 && (
                <div className="auth-form__errors">
                    {errorMessages.map((message, index) => (
                        <div key={index} className="auth-form__error-message">
                            {message}
                        </div>
                    ))}
                </div>
            )}
            
            {/* Опционально: демо-аккаунты для тестирования
            <div className="login-form__demo-accounts">
                <div className="login-form__demo-title">Try demo accounts:</div>
                <div className="login-form__demo-buttons">
                    <button 
                        type="button"
                        className="login-form__demo-button"
                        onClick={() => setFormData({ username: "user_demo", password: "demo123" })}
                    >
                        User Demo
                    </button>
                    <button 
                        type="button"
                        className="login-form__demo-button"
                        onClick={() => setFormData({ username: "admin_demo", password: "admin123" })}
                    >
                        Admin Demo
                    </button>
                </div>
            </div>
            */}
        </div>
    );
}