import { useEffect, useRef, useState } from "react";
import NavigationBar from "../../components/navigation/navigation-bar/navigation-bar";
import { downloadFile, downloadFiles, uploadMyFile } from "../../api/file-api";
import { Link, useParams } from "react-router-dom";
import "./user-photo-catalog.css";
import ImageGallery from "../../components/image-gallery/image-gallery";
import ImageUploadForm from "../../components/image-upload-form/image-upload-form";
import ImageViewer from "../../components/image-viewer/image-viewer";
import { updateMyProfilePictureId, getUser } from "../../api/user-api";
import getClaimFromToken from "../../utils/token-validation/token-validation";
import { useCallback } from "react";

export default function UserPhotoCatalog() {
    const { id } = useParams();
    const token = localStorage.getItem("accessToken");
    const tokenId = token ? getClaimFromToken(token, "id") : null;
    const isAccessToEdit = parseInt(id) === parseInt(tokenId);

    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(24);
    const [sort, setSort] = useState("uploadedAt:desc");
    const [isLoading, setIsLoading] = useState(true);
    const [totalPhotos, setTotalPhotos] = useState(0);
    const [userData, setUserData] = useState(null);
    const [userProfilePic, setUserProfilePic] = useState(null);

    const [pageResponse, setPageResponse] = useState({
        content: [],
        limit: 0,
        page: 0,
        totalElements: 0,
        totalPages: 0
    });

    // ImageViewer states
    const [viewStatus, setViewStatus] = useState(false);
    const [selectedPhoto, setSelectedPhoto] = useState(null);

    // ImageUploadForm states
    const [previewStatus, setPreviewStatus] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);

    const fetchUserData = useCallback(() => {
        getUser(id)
            .then((data) => {
                setUserData(data);
                downloadFile(data.profilePicId)
                    .then((url) => {
                        setUserProfilePic(url);
                    });
            })
            .catch((error) => {
                console.error("Error loading user data:", error);
            });
    }, [id]);

    const fetchPhotos = useCallback(() => {
        setIsLoading(true);
        downloadFiles("user", id, page, limit, sort)
            .then((data) => {
                setPageResponse(data);
                setTotalPhotos(data.totalElements);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error("Error loading photos:", error);
                setIsLoading(false);
            });
    }, [id, limit, page, sort]);
    
    // Загрузка данных пользователя и фотографий
    useEffect(() => {
        fetchUserData();
        fetchPhotos();
    }, [fetchUserData, fetchPhotos]);

    const handlePhotoClick = (photo) => {
        setSelectedPhoto(photo);
        setViewStatus(true);
    };

    const setProfilePicture = (photo) => {
        updateMyProfilePictureId(photo.fileId)
            .then(() => {
                // Обновляем данные пользователя
                fetchUserData();
                // Можно показать уведомление об успехе
                console.log("Profile picture updated successfully");
            })
            .catch((error) => {
                console.error("Error updating profile picture:", error);
                // Можно показать уведомление об ошибке
            });
    };

    const userActions = [
        {
            label: "Set as Profile Picture",
            handler: setProfilePicture,
            primary: true,
            icon: <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
        }
    ];

    const handleUploadPhoto = (evt) => {
        if (evt) evt.preventDefault();

        if (!selectedFile) {
            alert("Please select a file first");
            return;
        }

        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", selectedFile);

        uploadMyFile(formData, "user")
            .then(() => {
                // Cleanup preview
                if (previewUrl) {
                    URL.revokeObjectURL(previewUrl);
                }
                setPreviewStatus(false);
                setSelectedFile(null);
                setPreviewUrl(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
                setIsUploading(false);

                // Refresh photo list
                fetchPhotos();
            })
            .catch((error) => {
                console.error("Upload error:", error);
                alert("Error uploading photo");
                setIsUploading(false);
            });
    };

    const handleSortChange = (e) => {
        setSort(e.target.value);
        setPage(0); // Reset to first page when sorting changes
    };

    const handleLoadMore = () => {
        setLimit(prevLimit => prevLimit + 24);
    };

    const formatNumber = (num) => {
        return new Intl.NumberFormat().format(num);
    };

    const getUserDisplayName = () => {
        if (!userData) return "User";
        return userData.username || `User ${id}`;
    };

    return (
        <div className="user-photos">
            <NavigationBar />
            
            <div className="user-photos__content">
                <div className="user-photos__card">
                    <div className="user-photos__header">
                        <h1 className="user-photos__title">Photo Gallery</h1>
                        <p className="user-photos__subtitle">
                            Photos uploaded by <span className="user-photos__username">{getUserDisplayName()}</span>
                        </p>
                    </div>

                    {/* Информация о пользователе */}
                    {userData && (
                        <div className="user-photos__user-info">
                            <img
                                src={userProfilePic}
                                alt={getUserDisplayName()}
                                className="user-photos__avatar"
                                onError={(e) => {
                                    e.target.src = "https://via.placeholder.com/80/0088a3/ffffff?text=" + (userData.username?.charAt(0) || "U");
                                }}
                            />
                            <div className="user-photos__user-details">
                                <h2 className="user-photos__user-name">{getUserDisplayName()}</h2>
                                {userData.bio && (
                                    <p className="user-photos__user-bio">{userData.bio}</p>
                                )}
                            </div>
                            {isAccessToEdit && (
                                <div className="user-photos__owner-badge">
                                    <svg 
                                        className="user-photos__badge-icon" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                                    </svg>
                                    <span>Your Photos</span>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="user-photos__controls">
                        <Link 
                            to={`/user/${id}`} 
                            className="user-photos__back-button"
                        >
                            <svg 
                                className="user-photos__back-icon" 
                                viewBox="0 0 24 24"
                            >
                                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                            </svg>
                            Back to Profile
                        </Link>

                        <div className="user-photos__stats">
                            <div className="user-photos__stat">
                                <svg 
                                    className="user-photos__stat-icon" 
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                                </svg>
                                <span className="user-photos__stat-value">
                                    {formatNumber(totalPhotos)}
                                </span>
                                <span>photos</span>
                            </div>
                            
                            <div className="user-photos__filters">
                                <select 
                                    className="user-photos__select"
                                    value={sort}
                                    onChange={handleSortChange}
                                >
                                    <option value="uploadedAt:desc">Newest First</option>
                                    <option value="uploadedAt:asc">Oldest First</option>
                                    <option value="fileSize:desc">Largest First</option>
                                    <option value="fileSize:asc">Smallest First</option>
                                </select>
                            </div>
                        </div>

                        <ImageUploadForm
                            isAccessToEdit={isAccessToEdit}
                            handleUploadPhoto={handleUploadPhoto}
                            previewStatus={previewStatus}
                            setPreviewStatus={setPreviewStatus}
                            selectedFile={selectedFile}
                            setSelectedFile={setSelectedFile}
                            previewUrl={previewUrl}
                            setPreviewUrl={setPreviewUrl}
                            fileInputRef={fileInputRef}
                            isUploading={isUploading}
                        />
                    </div>

                    {isLoading ? (
                        <div className="user-photos__loading">
                            <div className="user-photos__spinner"></div>
                            <p>Loading photos...</p>
                        </div>
                    ) : pageResponse.content.length === 0 ? (
                        <div className="user-photos__empty">
                            <svg 
                                className="user-photos__empty-icon" 
                                viewBox="0 0 24 24"
                            >
                                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                            </svg>
                            <h3 className="user-photos__empty-title">No Photos Yet</h3>
                            <p className="user-photos__empty-text">
                                {isAccessToEdit 
                                    ? "Upload your first photo to share with others!"
                                    : "This user hasn't uploaded any photos yet."
                                }
                            </p>
                            {isAccessToEdit && (
                                <button
                                    className="user-photos__empty-action"
                                    onClick={() => {
                                        if (fileInputRef.current) {
                                            fileInputRef.current.click();
                                        }
                                    }}
                                >
                                    <svg 
                                        width="20" 
                                        height="20" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                                    </svg>
                                    Upload First Photo
                                </button>
                            )}
                        </div>
                    ) : (
                        <ImageGallery
                            pageResponse={pageResponse}
                            limit={limit}
                            setLimit={setLimit}
                            onPhotoClick={handlePhotoClick}
                            onLoadMore={handleLoadMore}
                        />
                    )}

                    <ImageViewer
                        isAccessToEdit={isAccessToEdit}
                        viewStatus={viewStatus}
                        setViewStatus={setViewStatus}
                        selectedPhoto={selectedPhoto}
                        setSelectedPhoto={setSelectedPhoto}
                        additionalActions={userActions}
                        photos={pageResponse.content}
                        currentIndex={pageResponse.content.findIndex(photo => 
                            selectedPhoto && (photo.id === selectedPhoto.id || photo.url === selectedPhoto.url)
                        )}
                        onIndexChange={(newIndex) => {
                            setSelectedPhoto(pageResponse.content[newIndex]);
                        }}
                    />
                </div>
            </div>
        </div>
    );
}