import { useEffect, useState } from "react";
import { updateUserData, updateUsername } from "../../../api/admin-user-api";
import { uploadFile } from "../../../api/admin-file-api";
import "./admin-user-data-edit.css";

function AdminUserDataEdit({ user, setUser }) {
    const [errorUsername, setErrorUsername] = useState("");
    const [errorDescription, setErrorDescription] = useState("");
    const [errorProfilePic, setErrorProfilePic] = useState("");
    const [isSubmittingUsername, setIsSubmittingUsername] = useState(false);
    const [isSubmittingDescription, setIsSubmittingDescription] = useState(false);
    const [isSubmittingProfilePic, setIsSubmittingProfilePic] = useState(false);

    const [formUsername, setFormUsername] = useState({
        username: user.username
    });

    const [formUserData, setFormUserData] = useState({
        description: user.description || ""
    });

    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [characterCount, setCharacterCount] = useState(0);

    useEffect(() => {
        setFormUsername({ username: user.username });
        setFormUserData({ description: user.description || "" });
        setCharacterCount((user.description || "").length);
    }, [user]);

    const handleChangeUsername = (e) => {
        const { name, value } = e.target;
        setFormUsername({ ...formUsername, [name]: value });
        setErrorUsername("");
    };

    const handleChangeUserData = (e) => {
        const { name, value } = e.target;
        setFormUserData({ ...formUserData, [name]: value });
        setCharacterCount(value.length);
        setErrorDescription("");
    };

    const validateUsername = () => {
        let errors = "";
        if (formUsername.username.length === 0) errors += "Username should not be empty; ";
        if (formUsername.username.length < 5) errors += "Username should be greater than 4 characters; ";
        if (formUsername.username.length > 20) errors += "Username should be less than or equal to 20 characters; ";

        if (errors !== "") {
            setErrorUsername(errors);
            return false;
        }

        return true;
    };

    const validateDescription = () => {
        if (formUserData.description.length > 500) {
            setErrorDescription("Description should be less than or equal to 500 characters");
            return false;
        }
        setErrorDescription("");
        return true;
    };

    const validateFile = (file) => {
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        const maxSize = 5 * 1024 * 1024; // 5MB

        if (!validTypes.includes(file.type)) {
            setErrorProfilePic("Invalid file type. Please upload JPEG, PNG, GIF, or WebP.");
            return false;
        }

        if (file.size > maxSize) {
            setErrorProfilePic("File size too large. Maximum size is 5MB.");
            return false;
        }

        setErrorProfilePic("");
        return true;
    };

    const handleUpdateUsername = async (evt) => {
        evt.preventDefault();

        if (!validateUsername()) return;

        setIsSubmittingUsername(true);
        try {
            await updateUsername(user.id, formUsername);
            setErrorUsername("");
            setUser({ ...user, username: formUsername.username });
        } catch (error) {
            console.error("Error updating username:", error);
            setErrorUsername(error.message || "Failed to update username. Please try again.");
        } finally {
            setIsSubmittingUsername(false);
        }
    };

    const handleUpdateUserData = async (evt) => {
        evt.preventDefault();

        if (!validateDescription()) return;

        setIsSubmittingDescription(true);
        try {
            await updateUserData(user.id, formUserData);
            setErrorDescription("");
            setUser({ ...user, description: formUserData.description });
        } catch (error) {
            console.error("Error updating description:", error);
            setErrorDescription("Failed to update description. Please try again.");
        } finally {
            setIsSubmittingDescription(false);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            if (validateFile(file)) {
                setSelectedFile(file);
                setPreviewUrl(URL.createObjectURL(file));
                setErrorProfilePic("");
            } else {
                setSelectedFile(null);
                setPreviewUrl(null);
            }
        }
    };

    const handleUploadProfilePicture = async (evt) => {
        evt.preventDefault();

        if (!selectedFile) {
            setErrorProfilePic("Please select a file first");
            return;
        }

        setIsSubmittingProfilePic(true);
        setErrorProfilePic("");

        try {
            const formData = new FormData();
            formData.append("file", selectedFile);

            await uploadFile(formData, "user-avatar", user.id);
            
            // Обновляем превью
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
            
            setSelectedFile(null);
            setPreviewUrl(null);
            
            // Показываем сообщение об успехе
            setErrorProfilePic("Profile picture uploaded successfully!");
            setTimeout(() => setErrorProfilePic(""), 3000);
            
        } catch (error) {
            console.error("Error uploading profile picture:", error);
            setErrorProfilePic(error.message || "Failed to upload profile picture. Please try again.");
        } finally {
            setIsSubmittingProfilePic(false);
        }
    };

    const handleResetForm = (formType) => {
        switch (formType) {
            case 'username':
                setFormUsername({ username: user.username });
                setErrorUsername("");
                break;
            case 'description':
                setFormUserData({ description: user.description || "" });
                setCharacterCount((user.description || "").length);
                setErrorDescription("");
                break;
            case 'profile':
                if (previewUrl) {
                    URL.revokeObjectURL(previewUrl);
                }
                setSelectedFile(null);
                setPreviewUrl(null);
                setErrorProfilePic("");
                break;
        default: return;
        }
    };

    return (
        <div className="edit-container">
            {/* Profile Picture */}
            <div className="edit-card">
                <h3>Profile Picture</h3>
                <div className="profile-preview">
                    {previewUrl ? (
                        <img
                            className="edit-avatar"
                            src={previewUrl}
                            alt="Preview"
                        />
                    ) : (
                        <div className="edit-avatar-placeholder">
                            <span className="placeholder-icon">🖼️</span>
                            <span className="placeholder-text">Select an image</span>
                        </div>
                    )}
                </div>
                <form onSubmit={handleUploadProfilePicture}>
                    <div className="file-input-wrapper">
                        <input 
                            id="profile-pic" 
                            type="file" 
                            onChange={handleFileChange}
                            accept="image/*"
                            className="file-input"
                        />
                        <label htmlFor="profile-pic" className="file-input-label">
                            Choose File
                        </label>
                        {selectedFile && (
                            <span className="file-name">{selectedFile.name}</span>
                        )}
                    </div>
                    <div className="form-actions">
                        <button 
                            type="submit" 
                            className="edit-btn"
                            disabled={!selectedFile || isSubmittingProfilePic}
                        >
                            {isSubmittingProfilePic ? (
                                <>
                                    <span className="loading-spinner-small"></span>
                                    Uploading...
                                </>
                            ) : 'Upload'}
                        </button>
                        <button 
                            type="button" 
                            className="edit-btn secondary"
                            onClick={() => handleResetForm('profile')}
                            disabled={!selectedFile}
                        >
                            Clear
                        </button>
                    </div>
                    {errorProfilePic && (
                        <div className={`status-message ${errorProfilePic.includes('successfully') ? 'success' : 'error'}`}>
                            {errorProfilePic}
                        </div>
                    )}
                </form>
            </div>

            {/* Username */}
            <div className="edit-card">
                <h3>Username</h3>
                <form onSubmit={handleUpdateUsername}>
                    <div className="input-with-counter">
                        <input
                            name="username"
                            type="text"
                            placeholder="Enter new username"
                            value={formUsername.username}
                            onChange={handleChangeUsername}
                            required
                            maxLength={20}
                            className={errorUsername ? 'error' : ''}
                            disabled={isSubmittingUsername}
                        />
                        <div className="char-counter">
                            {formUsername.username.length}/20
                        </div>
                    </div>
                    <div className="form-actions">
                        <button 
                            type="submit" 
                            className="edit-btn"
                            disabled={isSubmittingUsername || formUsername.username === user.username}
                        >
                            {isSubmittingUsername ? (
                                <>
                                    <span className="loading-spinner-small"></span>
                                    Updating...
                                </>
                            ) : 'Update'}
                        </button>
                        <button 
                            type="button" 
                            className="edit-btn secondary"
                            onClick={() => handleResetForm('username')}
                            disabled={formUsername.username === user.username || isSubmittingUsername}
                        >
                            Reset
                        </button>
                    </div>
                    {errorUsername && (
                        <div className="error-message">{errorUsername}</div>
                    )}
                </form>
            </div>

            {/* Description */}
            <div className="edit-card">
                <h3>
                    Description
                    <span className="char-counter-title">
                        {characterCount}/500
                    </span>
                </h3>
                <form onSubmit={handleUpdateUserData}>
                    <div className="textarea-with-counter">
                        <textarea
                            name="description"
                            rows="5"
                            placeholder="Enter user description..."
                            value={formUserData.description}
                            onChange={handleChangeUserData}
                            maxLength={500}
                            className={errorDescription ? 'error' : ''}
                            disabled={isSubmittingDescription}
                        />
                        <div className={`char-counter ${characterCount > 450 ? 'warning' : ''}`}>
                            {characterCount}/500
                        </div>
                    </div>
                    <div className="form-actions">
                        <button 
                            type="submit" 
                            className="edit-btn"
                            disabled={isSubmittingDescription || formUserData.description === (user.description || "")}
                        >
                            {isSubmittingDescription ? (
                                <>
                                    <span className="loading-spinner-small"></span>
                                    Updating...
                                </>
                            ) : 'Update'}
                        </button>
                        <button 
                            type="button" 
                            className="edit-btn secondary"
                            onClick={() => handleResetForm('description')}
                            disabled={formUserData.description === (user.description || "") || isSubmittingDescription}
                        >
                            Reset
                        </button>
                    </div>
                    {errorDescription && (
                        <div className="error-message">{errorDescription}</div>
                    )}
                </form>
            </div>
        </div>
    );
}

export default AdminUserDataEdit;