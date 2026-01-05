import { useState } from "react"
import { register } from "../../../api/auth-api";
import { useNavigate } from "react-router-dom";
import "./register-form.css";

export default function RegisterForm() {
    const navigate = useNavigate();

    const [errorMessages, setErrorMessages] = useState([]);
    const [fieldErrors, setFieldErrors] = useState({
        username: "",
        password: "",
        passwordConfirmation: ""
    });

    const [clientForm, setClientForm] = useState({
        username: "",
        password: "",
        passwordConfirmation: ""
    });

    const [passwordStrength, setPasswordStrength] = useState("");

    const validateField = (name, value, allFormData) => {
        switch (name) {
            case "username":
                if (value.length < 5) return "Username must be at least 5 characters";
                if (value.length > 20) return "Username must be less than 20 characters";
                if (!/^[a-zA-Z0-9_]+$/.test(value)) return "Only letters, numbers and underscore";
                return "";
            case "password":
                if (value.length < 5) return "Password must be at least 5 characters";
                
                // Проверка силы пароля
                let strength = "weak";
                if (value.length >= 8) strength = "medium";
                if (value.length >= 12 && /[A-Z]/.test(value) && /[0-9]/.test(value)) strength = "strong";
                setPasswordStrength(strength);
                
                if (allFormData.passwordConfirmation && value !== allFormData.passwordConfirmation)
                    return "Passwords don't match";
                return "";
            case "passwordConfirmation":
                if (value.length < 5) return "Password must be at least 5 characters";
                if (allFormData.password && value !== allFormData.password)
                    return "Passwords don't match";
                return "";
            default:
                return "";
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        const updatedFormData = { ...clientForm, [name]: value };
        setClientForm(updatedFormData);

        if (name === "password" || name === "passwordConfirmation") {
            const passwordError = validateField("password", updatedFormData.password, updatedFormData);
            const passwordConfirmationError = validateField("passwordConfirmation", updatedFormData.passwordConfirmation, updatedFormData);

            setFieldErrors(prev => ({
                ...prev,
                password: passwordError,
                passwordConfirmation: passwordConfirmationError
            }));
        } else {
            const error = validateField(name, value, updatedFormData);
            setFieldErrors(prev => ({
                ...prev,
                [name]: error
            }));
        }
    };

    const validateForm = () => {
        const errors = {};
        let isValid = true;

        errors.username = validateField("username", clientForm.username, clientForm);
        if (errors.username) isValid = false;

        errors.password = validateField("password", clientForm.password, clientForm);
        if (errors.password) isValid = false;

        errors.passwordConfirmation = validateField("passwordConfirmation", clientForm.passwordConfirmation, clientForm);
        if (errors.passwordConfirmation) isValid = false;

        setFieldErrors(errors);
        return isValid;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) {
            setErrorMessages(["Please fix the errors above"]);
            return;
        }

        if (clientForm.password === clientForm.passwordConfirmation) {
            const formData = {
                username: clientForm.username,
                password: clientForm.password
            }

            register(formData)
                .then(() => {
                    console.log("Register successful");
                    setErrorMessages([]);
                    navigate("/login");
                })
                .catch((error) => {
                    const messages = error.message ? error.message.split(';') : ["Registration failed"];
                    setErrorMessages(messages);
                })
        } else {
            setErrorMessages(["Password confirmation failed!"])
        }
    };

    const isFormValid = !fieldErrors.username && !fieldErrors.password && !fieldErrors.passwordConfirmation
        && clientForm.username && clientForm.password && clientForm.passwordConfirmation;

    return (
        <div className="auth-form">
            <form className="auth-form__form" method="POST" onSubmit={handleSubmit}>
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
                        value={clientForm.username}
                        onChange={handleChange}
                        required
                        placeholder="Enter 5-20 characters"
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
                        value={clientForm.password}
                        onChange={handleChange}
                        required
                        placeholder="Minimum 5 characters"
                    />
                    {fieldErrors.password ? (
                        <span className="auth-form__error">{fieldErrors.password}</span>
                    ) : clientForm.password && (
                        <div className="auth-form__password-strength">
                            <div className={`auth-form__password-strength-meter auth-form__password-strength-meter--${passwordStrength}`}></div>
                        </div>
                    )}
                    
                    {clientForm.password && (
                        <div className="auth-form__password-hints">
                            <div className="auth-form__password-hint">At least 5 characters</div>
                            <div className="auth-form__password-hint">Strong: 12+ chars with uppercase & numbers</div>
                        </div>
                    )}
                </div>

                <div className="auth-form__field">
                    <label className="auth-form__label" htmlFor="password-confirmation">
                        Confirm Password
                    </label>
                    <input
                        className={`auth-form__input ${fieldErrors.passwordConfirmation ? 'auth-form__input--error' : ''}`}
                        id="password-confirmation"
                        name="passwordConfirmation"
                        type="password"
                        minLength="5"
                        value={clientForm.passwordConfirmation}
                        onChange={handleChange}
                        required
                        placeholder="Confirm your password"
                    />
                    {fieldErrors.passwordConfirmation && (
                        <span className="auth-form__error">{fieldErrors.passwordConfirmation}</span>
                    )}
                </div>

                <button
                    className="auth-form__submit"
                    type="submit"
                    disabled={!isFormValid}
                >
                    Create Account
                </button>
            </form>
            
            {errorMessages.length > 0 && (
                <div className="auth-form__errors">
                    {errorMessages.map((message, index) => (
                        message && (
                            <div key={index} className="auth-form__error-message">
                                {message}
                            </div>
                        )
                    ))}
                </div>
            )}
        </div>
    );
}