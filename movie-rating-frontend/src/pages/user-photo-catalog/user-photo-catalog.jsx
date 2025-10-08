import { useEffect, useRef, useState } from "react";
import NavigationBar from "../../components/navigation/navigation-bar/navigation-bar";
import { downloadFiles, uploadMyFile, uploadUserFile } from "../../api/file-api";
import { Link, useParams } from "react-router-dom";
import "../../styles/user-photo-catalog.css";
import { updateMyProfilePictureId } from "../../api/user-api";
import getClaimFromToken from "../../utils/token-validation/token-validation";

export default function UserPhotoCatalog() {
    const { id } = useParams();
    const token = localStorage.getItem("accessToken");
    const tokenId = getClaimFromToken(token, "id");

    const [viewStatus, setViewStatus] = useState(false);
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [previewStatus, setPreviewStatus] = useState(false);

    const [photos, setPhotos] = useState([]);
    useEffect(() => {
        downloadFiles("user", id)
            .then((data) => {
                setPhotos(data);
            });
    }, []);

    const setProfilePicture = (photoId) => {
        updateMyProfilePictureId(photoId);
    };

    // UPLOAD NEW PHOTO
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setSelectedFile(file);

            const fileUrl = URL.createObjectURL(file);
            setPreviewUrl(fileUrl);
            setPreviewStatus(true);
        }
    };

    const handleUploadPhoto = (evt) => {
        if (evt) evt.preventDefault();

        if (!selectedFile) return;

        const formData = new FormData();
        formData.append("file", selectedFile);

        // Uploading file
        uploadMyFile(formData, "user")
            .then(() => {
                if (previewUrl) {
                    URL.revokeObjectURL(previewUrl);
                }
                setPreviewStatus(false);
                setSelectedFile(null);
                setPreviewUrl(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
                window.location.reload();
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const closePreview = () => {
        setPreviewStatus(false);
        setTimeout(() => {
            setSelectedFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
            setPreviewUrl(null);
        }, 300);
    };

    // Viewer
    const handleViewer = (photo) => {
        setSelectedPhoto(photo);
        setViewStatus(true);
    };

    const closeViewer = () => {
        setViewStatus(false);
        setTimeout(() => {
            setSelectedPhoto(null);
        }, 300);
    };

    // Close Viewer and Preview with ESC
    useEffect(() => {
        const handleEsc = (event) => {
            if (event.keyCode === 27) {
                if (viewStatus) closeViewer();
                if (previewStatus) closePreview();
            }
        };
        window.addEventListener('keydown', handleEsc);

        return () => {
            window.removeEventListener('keydown', handleEsc);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [viewStatus, previewStatus]);

    return (
        <>
            <NavigationBar />

            <div>
                <h1>Photo Catalog</h1>
            </div>

            <div className="page-content-container">
                <div className="page-content">
                    <div>
                        <div className="header-actions">
                            <Link to={`/user/${id}`} className="back-button">
                                ← Back to Profile
                            </Link>
                            {
                                id == tokenId &&
                                (
                                    <form onSubmit={handleUploadPhoto} className="upload-form">
                                        <div className="file-input-container">
                                            <input
                                                ref={fileInputRef}
                                                id="profile-pic"
                                                type="file"
                                                onChange={handleFileChange}
                                                className="file-input"
                                                accept="image/*"
                                            />
                                            <label htmlFor="profile-pic" className="file-input-label">
                                                Choose Photo
                                            </label>
                                            {selectedFile && (
                                                <span className="file-name">{selectedFile.name}</span>
                                            )}
                                        </div>
                                    </form>
                                )
                            }
                        </div>
                        <div className="user-photo-catalog">
                            {
                                photos.map((photo, index) => {
                                    return (
                                        <div
                                            className="photo-card"
                                            key={index}
                                            onClick={() => handleViewer(photo)}
                                        >
                                            <img
                                                className="user-photo"
                                                key={index}
                                                src={photo.url}
                                                alt={`Photo ${index + 1}`}
                                            />
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </div >

            {viewStatus && selectedPhoto && (
                <div className="photo-modal-overlay" onClick={closeViewer}>
                    <div className="photo-modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="close-button" onClick={closeViewer}>
                            ×
                        </button>
                        <img
                            src={selectedPhoto.url}
                            alt="Full screen"
                            className="fullscreen-photo"
                        />
                        <div className="photo-actions">
                            <button
                                onClick={() => setProfilePicture(selectedPhoto.fileId)}
                                className="action-button"
                            >
                                Set as Profile Picture
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {previewStatus && (
                <div className="photo-modal-overlay" onClick={closePreview}>
                    <div className="photo-modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="close-button" onClick={closePreview}>
                            ×
                        </button>
                        {previewUrl && (
                            <img
                                src={previewUrl}
                                alt="Preview"
                                className="fullscreen-photo"
                            />
                        )}
                        <div className="photo-actions">
                            <button
                                onClick={handleUploadPhoto}
                                className="upload-confirm-button"
                            >
                                Upload Photo
                            </button>
                            <button
                                onClick={closePreview}
                                className="cancel-button"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
