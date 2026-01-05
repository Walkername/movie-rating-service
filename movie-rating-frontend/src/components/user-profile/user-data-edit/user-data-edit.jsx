import { useEffect, useRef, useState } from "react";
import { updateMyUserData, updateMyUsername } from "../../../api/user-api";
import { uploadMyFile } from "../../../api/file-api";
import "./user-data-edit.css";
import ImageUploadViewer from "../../image-upload-viewer/image-upload-viewer";

function UserDataEdit({ isAccessToEdit, user, setUser, handleEdit }) {
    const [errorUsername, setErrorUsername] = useState("");
    const [errorDescription, setErrorDescription] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formUsername, setFormUsername] = useState({
        username: user.username
    });

    const [formUserData, setFormUserData] = useState({
        description: user.description || ""
    });

    // PROFILE PICTURE
    const [previewStatus, setPreviewStatus] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);

    // Обновляем формы при изменении пользователя
    useEffect(() => {
        setFormUsername({ username: user.username });
        setFormUserData({ description: user.description || "" });
    }, [user]);

    // Валидации
    const validateUsername = () => {
        const username = formUsername.username.trim();
        if (username.length === 0) {
            setErrorUsername("Username is required");
            return false;
        }
        if (username.length < 5) {
            setErrorUsername("Username must be at least 5 characters");
            return false;
        }
        if (username.length > 20) {
            setErrorUsername("Username must be 20 characters or less");
            return false;
        }
        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            setErrorUsername("Only letters, numbers and underscores allowed");
            return false;
        }
        setErrorUsername("");
        return true;
    };

    const validateDescription = () => {
        const description = formUserData.description || "";
        if (description.length > 500) {
            setErrorDescription("Description must be 500 characters or less");
            return false;
        }
        setErrorDescription("");
        return true;
    };

    const handleChangeUsername = (e) => {
        const { value } = e.target;
        setFormUsername({ username: value });
        if (value.trim()) validateUsername();
    };

    const handleChangeUserData = (e) => {
        const { value } = e.target;
        setFormUserData({ description: value });
        if (value.trim()) validateDescription();
    };

    const handleUpdateUsername = async (evt) => {
        evt.preventDefault();
        if (!validateUsername()) return;
        
        setIsSubmitting(true);
        try {
            await updateMyUsername(formUsername);
            setUser({ ...user, username: formUsername.username });
            setErrorUsername("");
        } catch (error) {
            setErrorUsername(error.message || "Error updating username");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateUserData = async (evt) => {
        evt.preventDefault();
        if (!validateDescription()) return;
        
        setIsSubmitting(true);
        try {
            await updateMyUserData(formUserData);
            setUser({ ...user, description: formUserData.description });
            setErrorDescription("");
        } catch (error) {
            setErrorDescription("Error updating description");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Обработка файлов
    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            
            // Валидация
            if (!file.type.startsWith('image/')) {
                alert("Please select an image file");
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                alert("File size must be less than 5MB");
                return;
            }
            
            setSelectedFile(file);
            const fileUrl = URL.createObjectURL(file);
            setPreviewUrl(fileUrl);
            setPreviewStatus(true);
        }
    };

    const handleUploadProfilePicture = async (evt) => {
        evt.preventDefault();
        if (!selectedFile) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
            await uploadMyFile(formData, "user-avatar");
            // Успешная загрузка
            handleCancelUpload();
            // Обновляем пользователя или перезагружаем страницу
            window.location.reload();
        } catch (error) {
            alert("Error uploading profile picture");
        } finally {
            setIsUploading(false);
        }
    };

    const handleCancelUpload = () => {
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewStatus(false);
        setSelectedFile(null);
        setPreviewUrl(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Определяем доступные символы
    const usernameCharsLeft = 20 - formUsername.username.length;
    const descriptionCharsLeft = 500 - (formUserData.description?.length || 0);

    return (
        <div className="user-edit">
            <div className="user-edit__header">
                <h2 className="user-edit__title">Edit Profile</h2>
                <div className="user-edit__actions">
                    <button 
                        className="user-edit__button user-edit__button--back"
                        onClick={handleEdit}
                        type="button"
                    >
                        ← Back to Profile
                    </button>
                </div>
            </div>

            {/* Аватар */}
            <div className="user-edit__card">
                <h3 className="user-edit__card-title">Profile Picture</h3>
                <div className="user-edit__avatar-section">
                    {selectedFile ? (
                        <div className="user-edit__avatar-preview">
                            <img src={previewUrl} alt="Avatar preview" />
                        </div>
                    ) : (
                        <p className="user-edit__file-info">
                            Current profile picture is displayed on your profile
                        </p>
                    )}
                    
                    <div className="user-edit__file-upload">
                        <input
                            ref={fileInputRef}
                            id="profile-pic"
                            type="file"
                            onChange={handleFileChange}
                            className="user-edit__file-input"
                            accept="image/*"
                        />
                        <label 
                            htmlFor="profile-pic" 
                            className="user-edit__file-label"
                        >
                            Choose New Avatar
                        </label>
                        
                        {selectedFile && (
                            <>
                                <button
                                    type="button"
                                    className="user-edit__upload-button"
                                    onClick={handleUploadProfilePicture}
                                    disabled={isUploading}
                                >
                                    {isUploading ? "Uploading..." : "Upload Avatar"}
                                </button>
                                <button
                                    type="button"
                                    className="user-edit__cancel-upload"
                                    onClick={handleCancelUpload}
                                >
                                    Cancel
                                </button>
                                <p className="user-edit__file-info">
                                    Selected: {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
                                </p>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Имя пользователя */}
            <div className="user-edit__card">
                <h3 className="user-edit__card-title">Username</h3>
                <form className="user-edit__form" onSubmit={handleUpdateUsername}>
                    <div className="user-edit__field">
                        <label className="user-edit__label" htmlFor="username">
                            Username *
                        </label>
                        <input
                            className="user-edit__input"
                            id="username"
                            type="text"
                            name="username"
                            placeholder="Enter username"
                            value={formUsername.username}
                            onChange={handleChangeUsername}
                            required
                            maxLength={20}
                        />
                        <div className={`user-edit__char-count ${usernameCharsLeft < 10 ? 'user-edit__char-count--warning' : ''}`}>
                            {usernameCharsLeft} characters left
                        </div>
                        {errorUsername && <div className="user-edit__error">{errorUsername}</div>}
                    </div>
                    <button
                        type="submit"
                        className="user-edit__button user-edit__button--update"
                        disabled={isSubmitting || !formUsername.username.trim()}
                    >
                        {isSubmitting ? "Updating..." : "Update Username"}
                    </button>
                </form>
            </div>

            {/* Описание */}
            <div className="user-edit__card">
                <h3 className="user-edit__card-title">About Me</h3>
                <form className="user-edit__form" onSubmit={handleUpdateUserData}>
                    <div className="user-edit__field">
                        <label className="user-edit__label" htmlFor="description">
                            Description
                        </label>
                        <textarea
                            className="user-edit__textarea"
                            id="description"
                            name="description"
                            placeholder="Tell others about yourself..."
                            value={formUserData.description}
                            onChange={handleChangeUserData}
                            maxLength={500}
                            rows={5}
                        />
                        <div className={`user-edit__char-count ${descriptionCharsLeft < 50 ? 'user-edit__char-count--warning' : ''}`}>
                            {descriptionCharsLeft} characters left
                        </div>
                        {errorDescription && <div className="user-edit__error">{errorDescription}</div>}
                    </div>
                    <button
                        type="submit"
                        className="user-edit__button user-edit__button--update"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Updating..." : "Update Description"}
                    </button>
                </form>
            </div>

            <ImageUploadViewer
                previewStatus={previewStatus}
                setPreviewStatus={setPreviewStatus}
                handleUploadPhoto={handleUploadProfilePicture}
                setSelectedFile={setSelectedFile}
                fileInputRef={fileInputRef}
                previewUrl={previewUrl}
                setPreviewUrl={setPreviewUrl}
                selectedFile={selectedFile}
                isUploading={isUploading}
            />
        </div>
    );
}

export default UserDataEdit;