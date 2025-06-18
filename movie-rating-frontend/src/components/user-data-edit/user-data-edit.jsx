import { useState } from "react";
import getClaimFromToken from "../../utils/token-validation/token-validation";
import { updateUserData, updateUsername } from "../../api/user-api";

function UserDataEdit({ user }) {
    const token = localStorage.getItem("token");
    const id = getClaimFromToken(token, "id");

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

    const handleUpdateUsername = (evt) => {
        evt.preventDefault();

        updateUsername(id, formUsername)
            .then((data) => {
                console.log("Updated successfully:", data);
            })
            .catch((error) => {
                console.error("Error:", error);
            });

        window.location.reload();
    };

    const handleUpdateUserData = (evt) => {
        evt.preventDefault();

        updateUserData(user.id, formUserData)
            .then((data) => {
                console.log("Updated successfully:", data);
            })
            .catch((error) => {
                console.error("Error:", error);
            });

        window.location.reload();
    };

    return (
        <div>
            <form method="PATCH" onSubmit={handleUpdateUsername}>
                <label>Username:</label>
                <br></br>
                <input name="username" type="text" placeholder="username" value={formUsername.username}
                    onChange={handleChangeUsername}
                    required
                />{"  "}

                <input type="submit" value="Update" />
            </form>

            <form method="PATCH" onSubmit={handleUpdateUserData}>
                <label>Description:</label>
                <br></br>
                <textarea name="description" type="text" rows="5" placeholder="..." value={formUserData.description}
                    onChange={handleChangeUserData}
                    required >
                </textarea> 
                {"  "}
                <br></br>

                <input type="submit" value="Update" />
            </form>
        </div>
    )
}

export default UserDataEdit;