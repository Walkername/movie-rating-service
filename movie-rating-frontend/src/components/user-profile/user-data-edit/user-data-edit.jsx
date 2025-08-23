import { useEffect, useState } from "react";
import getClaimFromToken from "../../../utils/token-validation/token-validation";
import { updateProfilePicture, updateProfilePictureId, updateUserData, updateUsername } from "../../../api/user-api";
import { uploadFile } from "../../../api/file-api";
import "../../../styles/user-data-edit.css";

function UserDataEdit({ user, setUser }) {
    const token = localStorage.getItem("accessToken");
    const id = getClaimFromToken(token, "id");

    const [errorUsername, setErrorUsername] = useState("");
    const [errorDescription, setErrorDescription] = useState("");

    const [formUsername, setFormUsername] = useState({
        username: user.username
    });

    const [formUserData, setFormUserData] = useState({
        description: user.description
    });

    useEffect(() => {
        setFormUsername({ username: user.username });
        setFormUserData({ description: user.description });
    }, [user]);

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
            updateUsername(user.id, formUsername)
                .then(() => {
                    setErrorUsername("");
                    setUser({ ...user, username: formUsername.username });
                    //window.location.reload();
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
                    setUser({ ...user, description: formUserData.description });
                    //window.location.reload();
                })
                .catch((error) => {
                    console.error("Error:", error);
                });
        }
    };

    // PROFILE PICTURE

    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadedFileId, setUploadedFileId] = useState(null);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleUploadProfilePicture = (evt) => {
        evt.preventDefault();

        if (!selectedFile) return;

        const formData = new FormData();
        formData.append("file", selectedFile);

        // Uploading file
        uploadFile(formData, "user", user.id)
            .then((data) => {
                setUploadedFileId(data);
                // Update profile picture ID
                updateProfilePictureId(user.id, data)
                    .catch((error) => {
                        console.log(error);
                    });
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <div className="edit-container">
            {/* Фото профиля */}
            <div className="edit-card">
                <h3>Profile Picture</h3>
                {selectedFile && (
                    <img
                        className="edit-avatar"
                        src={URL.createObjectURL(selectedFile)}
                        alt={selectedFile.name}
                    />
                )}
                <form onSubmit={handleUploadProfilePicture}>
                    <input id="profile-pic" type="file" onChange={handleFileChange} />
                    <button type="submit" className="edit-btn">Upload</button>
                </form>
            </div>

            {/* Имя пользователя */}
            <div className="edit-card">
                <h3>Username</h3>
                <form onSubmit={handleUpdateUsername}>
                    <input
                        name="username"
                        type="text"
                        placeholder="username"
                        value={formUsername.username}
                        onChange={handleChangeUsername}
                        required
                    />
                    <button type="submit" className="edit-btn">Update</button>
                    {errorUsername && <p className="error-text">{errorUsername}</p>}
                </form>
            </div>

            {/* Описание */}
            <div className="edit-card">
                <h3>Description</h3>
                <form onSubmit={handleUpdateUserData}>
                    <textarea
                        name="description"
                        rows="5"
                        placeholder="..."
                        value={formUserData.description}
                        onChange={handleChangeUserData}
                    ></textarea>
                    <button type="submit" className="edit-btn">Update</button>
                    {errorDescription && <p className="error-text">{errorDescription}</p>}
                </form>
            </div>
        </div>
    );
}

export default UserDataEdit;