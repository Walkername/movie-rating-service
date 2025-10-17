import { useState } from "react";
import { login } from "../../../api/auth-api";
import { useNavigate } from "react-router-dom";
import getClaimFromToken from "../../../utils/token-validation/token-validation";
import "./login-form.css";

export default function LoginForm() {
    const navigate = useNavigate();

    const [errorMessages, setErrorMessages] = useState([]);
    const [fieldErrors, setFieldErrors] = useState({
        username: "",
        password: ""
    });

    const [formData, setFormData] = useState({
        username: "",
        password: ""
    });

    const validateField = (name, value) => {
        switch (name) {
            case "username":
                if (value.length < 5) return "Username must be at least 5 characters";
                if (value.length > 20) return "Username must be less than 20 characters";
                if (!/^[a-zA-Z0-9_]+$/.test(value)) return "Username can only contain letters, numbers and underscore";
                return "";
            case "password":
                if (value.length < 5) return "Password must be at least 5 characters";
                return "";
            default:
                return "";
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Validation in real time
        const error = validateField(name, value);
        setFieldErrors(prev => ({
            ...prev,
            [name]: error
        }));

        setFormData({ ...formData, [name]: value });
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

        login(formData)
            .then((data) => {
                console.log("Login successfully:", data);
                setErrorMessages([]);
                localStorage.setItem("accessToken", data.accessToken);
                localStorage.setItem("refreshToken", data.refreshToken);
                const id = getClaimFromToken(data.accessToken, "id");
                navigate(`/user/${id}`);
            })
            .catch((error) => {
                console.error("Error:", error);
                setErrorMessages(["Wrong username or password!"]);
            });
    };

    const isFormValid = !fieldErrors.username && !fieldErrors.password && formData.username && formData.password;

    return (
        <div className="login-form-container">
            <form className="login-form" onSubmit={handleSubmit} noValidate>
                <div className="form-field">
                    <label className="login-username-label" htmlFor="username">
                        Username:
                    </label>
                    <input
                        className={`login-username-input ${fieldErrors.username ? 'error' : ''}`}
                        id="username"
                        name="username"
                        type="text"
                        minLength="5"
                        maxLength="20"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        placeholder="5-20 characters, letters/numbers only"
                    />
                    {fieldErrors.username && (
                        <span className="field-error">{fieldErrors.username}</span>
                    )}
                </div>

                <div className="form-field">
                    <label className="login-password-label" htmlFor="password">
                        Password:
                    </label>
                    <input
                        className={`login-password-input ${fieldErrors.password ? 'error' : ''}`}
                        id="password"
                        name="password"
                        type="password"
                        minLength="5"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        placeholder="At least 5 characters"
                    />
                    {fieldErrors.password && (
                        <span className="field-error">{fieldErrors.password}</span>
                    )}
                </div>

                <input 
                    className="login-button" 
                    type="submit" 
                    value="Login" 
                    disabled={!isFormValid}
                />
            </form>
            <div className="form-errors">
                {errorMessages.length !== 0 &&
                    errorMessages.map((message, index) => {
                        return message !== "" && (
                            <span key={index} style={{ color: "red" }}>{message}</span>
                        );
                    })
                }
            </div>
        </div>
    );
}