import { useState } from "react";
import getClaimFromToken from "../../utils/token-validation/token-validation";
import { updateUserData, updateUsername } from "../../api/user-api";

function UserDataEdit({ user }) {
    const token = localStorage.getItem("token");
    const id = getClaimFromToken(token, "id");

    const [errorUsername, setErrorUsername] = useState("");
    const [errorDescription, setErrorDescription] = useState("");

    const [formUsername, setFormUsername] = useState({
        username: user.username
    });

    const [formUserData, setFormUserData] = useState({
        description: user.description
    });

    const handleChangeUsername = (e) => {
        const { name, value } = e.target;
        setFormUsername({ ...formUsername, [name]: value });
    };

    const handleChangeUserData = (e) => {
        const { name, value } = e.target;
        setFormUserData({ ...setFormUserData, [name]: value });
    };

    const validateUsername = () => {
        let errors = "";
        errors += formUsername.username.length === 0 ? "Username should not be empty;" : "";
        errors += formUsername.username.length < 5 ? "Username should be greater than 4;" : "";
        errors += formUsername.username.length > 20 ? "Username should be less or equal than 20;" : "";

        if (errors !== "") {
            setErrorUsername(errors);
            return false;
        }

        return true;
    }

    const validateDescription = () => {
        if (formUserData.description.length > 500) {
            setErrorDescription("Description should be less or equal than 500");
            return false;
        } else {
            return true;
        }
    }

    const handleUpdateUsername = (evt) => {
        evt.preventDefault();

        if (validateUsername()) {
            updateUsername(id, formUsername)
                .then(() => {
                    setErrorUsername("");
                    window.location.reload();
                })
                .catch((error) => {
                    console.error("Error:", error);
                    setErrorUsername(error.message.split(";"));
                });
        }
    };

    const handleUpdateUserData = (evt) => {
        evt.preventDefault();

        if (validateDescription()) {
            updateUserData(user.id, formUserData)
                .then(() => {
                    setErrorDescription("");
                    window.location.reload();
                })
                .catch((error) => {
                    console.error("Error:", error);
                });
        }
    };

    return (
        <div>
            <form method="PATCH" onSubmit={handleUpdateUsername}>
                <label>Username:</label>
                <br></br>
                <input name="username" min="5" max="20" type="text" placeholder="username" value={formUsername.username}
                    onChange={handleChangeUsername}
                    required
                />
                <input type="submit" value="Update" />
                {
                    errorUsername !== ""
                        ? <>
                            <br />
                            <span style={{ color: "red" }}>{errorUsername}</span>
                        </>
                        : <></>
                }
            </form>

            <form method="PATCH" onSubmit={handleUpdateUserData}>
                <label>Description:</label>
                <br></br>
                <textarea name="description" max="500" type="text" rows="5" placeholder="..." value={formUserData.description}
                    onChange={handleChangeUserData}
                    >
                </textarea>
                {
                    errorDescription !== ""
                        ? <>
                            <br />
                            <span style={{ color: "red" }}>{errorDescription}</span>
                        </>
                        : <></>
                }
                <br></br>

                <input type="submit" value="Update" />
            </form>
        </div>
    )
}

export default UserDataEdit;