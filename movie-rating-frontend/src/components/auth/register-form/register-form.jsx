import { useState } from "react"
import { register } from "../../../api/auth-api";
import { useNavigate } from "react-router-dom";

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
        <form method="POST" onSubmit={handleSubmit}>
            <label>Username:</label>
            <br></br>
            <input name="username" type="text" min="5" max="20" value={clientForm.username} onChange={handleChange} required />
            <br></br>

            <label>Password:</label>
            <br></br>
            <input name="password" type="password" min="5" value={clientForm.password} onChange={handleChange} required />
            <br></br>

            <label>Password confirmation:</label>
            <br></br>
            <input name="passwordConfirmation" type="password" value={clientForm.passwordConfirmation} onChange={handleChange} required />
            <br></br>
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

            <input type="submit" value="Register" />
        </form>
    )
}