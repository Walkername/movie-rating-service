import { useState } from "react"
import { register } from "../../../api/auth-api";
import { useNavigate } from "react-router-dom";
import "./register-form.css";

export default function RegisterForm() {
    const navigate = useNavigate();

    const [errorMessages, setErrorMessages] = useState([]);

    const [clientForm, setClientForm] = useState({
        username: "",
        password: "",
        passwordConfirmation: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setClientForm({ ...clientForm, [name]: value });
    }

    const handleSubmit = (e) => {
        e.preventDefault();

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
    }

    return (
        <>
            <form className="register-form" method="POST" onSubmit={handleSubmit}>
                <label className="register-username-label" htmlFor="username">
                    Username:
                </label>
                <input
                    className="register-username-input"
                    id="username"
                    name="username"
                    type="text"
                    min="5"
                    max="20"
                    value={clientForm.username}
                    onChange={handleChange}
                    required
                />

                <label className="register-password-label" htmlFor="password">
                    Password:
                </label>
                <input
                    className="register-password-input"
                    id="password"
                    name="password"
                    type="password"
                    min="5"
                    value={clientForm.password}
                    onChange={handleChange}
                    required
                />

                <label className="register-password-confirmation-label" htmlFor="password-confirmation">
                    Password confirmation:
                </label>
                <input
                    className="register-password-confirmation-input"
                    id="password-confirmation"
                    name="passwordConfirmation"
                    type="password"
                    value={clientForm.passwordConfirmation}
                    onChange={handleChange}
                    required
                />

                <input className="register-button" type="submit" value="Register" />
            </form>
            <div>
                {
                    errorMessages.map((message, index) => {
                        return message != "" && (
                            <>
                                <span key={index} style={{ color: "red" }}>{message}</span>
                                <br></br>
                            </>
                        );
                    })
                }
            </div>
        </>
    );
}