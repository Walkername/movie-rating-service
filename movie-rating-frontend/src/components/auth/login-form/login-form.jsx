import { useState } from "react";
import { login } from "../../../api/auth-api";
import { useNavigate } from "react-router-dom";
import getClaimFromToken from "../../../utils/token-validation/token-validation";
import "./login-form.css";

export default function LoginForm() {
    const navigate = useNavigate();
    const [errorMessages, setErrorMessages] = useState([]);

    const [formData, setFormData] = useState({
        username: "",
        password: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

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
    }

    return (
        <>
            <form className="login-form" onSubmit={handleSubmit}>
                <label className="login-username-label" htmlFor="username">
                    Username:
                </label>
                <input
                    className="login-username-input"
                    id="username"
                    name="username"
                    type="text"
                    min="5"
                    max="20"
                    value={formData.title}
                    onChange={handleChange}
                    required
                />

                <label className="login-password-label" htmlFor="password">
                    Password:
                </label>
                <input
                    className="login-password-input"
                    id="password"
                    name="password"
                    type="password"
                    min="5"
                    value={formData.title}
                    onChange={handleChange}
                    required
                />

                <input className="login-button" type="submit" value="Login" />
            </form>
            <div>
                {
                    errorMessages.length != 0 ?
                        errorMessages.map((message, index) => {
                            return message != "" && (
                                    <span key={index} style={{ color: "red" }}>{message}</span>
                            );
                        })
                        : <div></div>
                }
            </div>
        </>
    );
}