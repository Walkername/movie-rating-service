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

    const validateField = (name, value, allFormData) => {
        switch (name) {
            case "username":
                if (value.length < 5) return "Username must be at least 5 characters";
                if (value.length > 20) return "Username must be less than 20 characters";
                if (!/^[a-zA-Z0-9_]+$/.test(value)) return "Username can only contain letters, numbers and underscore";
                return "";
            case "password":
                if (value.length < 5) return "Password must be at least 5 characters";
                if (allFormData.passwordConfirmation && value !== allFormData.passwordConfirmation)
                    return "Typed passwords are not the same";
                return "";
            case "passwordConfirmation":
                if (value.length < 5) return "Password must be at least 5 characters";
                if (allFormData.password && value !== allFormData.password)
                    return "Typed passwords are not the same";
                return "";
            default:
                return "";
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        const updatedFormData = { ...clientForm, [name]: value };
        setClientForm(updatedFormData);

        // Validate two fields when any of them changes
        if (name === "password" || name === "passwordConfirmation") {
            const passwordError = validateField("password", updatedFormData.password, updatedFormData);
            const passwordConfirmationError = validateField("passwordConfirmation", updatedFormData.passwordConfirmation, updatedFormData);

            setFieldErrors(prev => ({
                ...prev,
                password: passwordError,
                passwordConfirmation: passwordConfirmationError
            }));
        } else {
            // For the remaining fields, standard validation
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

        errors.username = validateField("username", clientForm.username);
        if (errors.username) isValid = false;

        errors.password = validateField("password", clientForm.password);
        if (errors.password) isValid = false;

        errors.passwordConfirmation = validateField("passwordConfirmation", clientForm.passwordConfirmation);
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

        if (clientForm.passwordConfirmation === clientForm.password) {
            const formData = {
                username: clientForm.username,
                password: clientForm.password
            }

            register(formData)
                .then(() => {
                    console.log("Register successfully");
                    setErrorMessages([]);
                    navigate("/login");
                })
                .catch((error) => {
                    setErrorMessages(error.message.split(';'));
                    console.log(errorMessages);
                })
        } else {
            setErrorMessages(["Password Confirmation failed!"])
        }
    };

    const isFormValid = !fieldErrors.username && !fieldErrors.password && !fieldErrors.passwordConfirmation
        && clientForm.username && clientForm.password && clientForm.passwordConfirmation;

    return (
        <div className="register-form-container">
            <form className="register-form" method="POST" onSubmit={handleSubmit}>
                <div className="form-field">
                    <label className="register-username-label" htmlFor="username">
                        Username:
                    </label>
                    <input
                        className={`register-username-input ${fieldErrors.username ? 'error' : ''}`}
                        id="username"
                        name="username"
                        type="text"
                        minLength="5"
                        maxLength="20"
                        value={clientForm.username}
                        onChange={handleChange}
                        required
                        placeholder="5-20 characters, letters/numbers only"
                    />
                    {fieldErrors.username && (
                        <span className="field-error">{fieldErrors.username}</span>
                    )}
                </div>

                <div className="form-field">
                    <label className="register-password-label" htmlFor="password">
                        Password:
                    </label>
                    <input
                        className={`register-password-input ${fieldErrors.password ? 'error' : ''}`}
                        id="password"
                        name="password"
                        type="password"
                        minLength="5"
                        value={clientForm.password}
                        onChange={handleChange}
                        required
                        placeholder="At least 5 characters"
                    />
                    {fieldErrors.password && (
                        <span className="field-error">{fieldErrors.password}</span>
                    )}
                </div>

                <div className="form-field">
                    <label className="register-password-confirmation-label" htmlFor="password-confirmation">
                        Password confirmation:
                    </label>
                    <input
                        className={`register-password-confirmation-input ${fieldErrors.passwordConfirmation ? 'error' : ''}`}
                        id="password-confirmation"
                        name="passwordConfirmation"
                        type="password"
                        minLength="5"
                        value={clientForm.passwordConfirmation}
                        onChange={handleChange}
                        required
                        placeholder="At least 5 characters"
                    />
                    {fieldErrors.passwordConfirmation && (
                        <span className="field-error">{fieldErrors.passwordConfirmation}</span>
                    )}
                </div>

                <input
                    className="register-button"
                    type="submit"
                    value="Register"
                    disabled={!isFormValid}
                />
            </form>
            <div className="form-errors">
                {
                    errorMessages.length !== 0 &&
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