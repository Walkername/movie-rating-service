import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import RatedMoviesList from "../rated-movies-list/rated-movies-list";
import { downloadFile } from "../../../api/file-api";
import unknownProfilePic from "../../../assets/images/unknown-profile-avatar.png";
import PhotoPreviewStrip from "../../photo-preview-strip/photo-preview-strip";
import { updateMyProfilePictureId } from "../../../api/user-api";
import "./user-data.css";

function UserData({ isAccessToEdit, user, handleEdit, currentUserId = null }) {
    const [profilePicUrl, setProfilePicUrl] = useState(null);
    const [isProfilePicLoading, setIsProfilePicLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState(null);

    useEffect(() => {
        if (!user.profilePicId) {
            setIsProfilePicLoading(false);
            return;
        }
        
        setIsProfilePicLoading(true);
        downloadFile(user.profilePicId)
            .then((data) => {
                setProfilePicUrl(data);
                setIsProfilePicLoading(false);
            })
            .catch((error) => {
                console.error("Error loading profile picture:", error);
                setIsProfilePicLoading(false);
            });
    }, [user.profilePicId]);

    useEffect(() => {
        // Определяем когда был обновлен профиль
        const dates = [];
        if (user.createdAt) dates.push(new Date(user.createdAt));
        if (user.updatedAt) dates.push(new Date(user.updatedAt));
        
        if (dates.length > 0) {
            const latestDate = new Date(Math.max(...dates.map(d => d.getTime())));
            setLastUpdated(latestDate);
        }
    }, [user]);

    // PhotoPreviewStrip
    const setProfilePicture = (photo) => {
        updateMyProfilePictureId(photo.fileId)
            .then(() => {
                // Можно добавить уведомление об успехе
                console.log("Profile picture updated successfully");
                // Обновляем URL аватара
                if (photo.url) {
                    setProfilePicUrl(photo.url);
                }
            })
            .catch((error) => {
                console.error("Error updating profile picture:", error);
                // Можно добавить уведомление об ошибке
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

    const formatDate = (dateString) => {
        if (!dateString) return 'Unknown';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch {
            return 'Unknown';
        }
    };

    const getUserStatus = () => {
        if (user.role === "ADMIN") return "Administrator";
        if (currentUserId && parseInt(user.id) === currentUserId) return "You";
        return "Member";
    };

    const getAverageRatingDisplay = () => {
        if (user.averageRating === null || user.averageRating === undefined) {
            return "No ratings yet";
        }
        return `${user.averageRating.toFixed(1)}/10`;
    };

    return (
        <div className="user-profile">
            <div className="user-profile__avatar">
                {isProfilePicLoading ? (
                    <div className="user-profile__avatar-loading">
                        <div className="user-profile__avatar-spinner"></div>
                    </div>
                ) : (
                    <img
                        className="user-profile__avatar-img"
                        src={profilePicUrl || unknownProfilePic}
                        alt={`${user.username}'s profile`}
                        onError={(e) => {
                            e.target.src = unknownProfilePic;
                        }}
                    />
                )}
                
                {user.role === "ADMIN" && (
                    <div className="user-profile__avatar-badge user-profile__avatar-badge--admin">
                        Admin
                    </div>
                )}
            </div>
            
            <div className="user-profile__content">
                <div className="user-profile__header">
                    <h1 className="user-profile__username">
                        {user.username}
                        <span className="user-profile__user-id">#{user.id}</span>
                    </h1>
                    
                    <div className="user-profile__stats">
                        <div className="user-profile__stat">
                            <span className="user-profile__stat-value">
                                {user.scores || 0}
                            </span>
                            <span className="user-profile__stat-label">Ratings</span>
                        </div>
                        
                        <div className="user-profile__stat">
                            <span className="user-profile__stat-value">
                                {getAverageRatingDisplay()}
                            </span>
                            <span className="user-profile__stat-label">Avg Rating</span>
                        </div>
                    </div>
                </div>
                
                <div className="user-profile__info">
                    <div className="user-profile__section">
                        <h3 className="user-profile__section-title">About</h3>
                        <p className={`user-profile__section-text ${!user.description ? 'user-profile__section-text--empty' : ''}`}>
                            {user.description || "This user hasn't written a description yet."}
                        </p>
                    </div>
                    
                    <div className="user-profile__section">
                        <h3 className="user-profile__section-title">Activity</h3>
                        <div className="user-profile__meta">
                            <div className="user-profile__meta-item">
                                <svg 
                                    className="user-profile__meta-icon" 
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM13 17h-2v-6h2v6zm0-8h-2V7h2v2z" />
                                </svg>
                                <span>Status: {getUserStatus()}</span>
                            </div>
                            
                            {user.createdAt && (
                                <div className="user-profile__meta-item">
                                    <svg 
                                        className="user-profile__meta-icon" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10z" />
                                    </svg>
                                    <span>Joined: {formatDate(user.createdAt)}</span>
                                </div>
                            )}
                            
                            {lastUpdated && (
                                <div className="user-profile__meta-item">
                                    <svg 
                                        className="user-profile__meta-icon" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                                    </svg>
                                    <span>Last active: {formatDate(lastUpdated)}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                
                <div className="user-profile__actions">
                    {isAccessToEdit && (
                        <button 
                            className="user-profile__edit-button"
                            onClick={handleEdit}
                        >
                            Edit Profile
                        </button>
                    )}
                    
                    <Link 
                        to={`/user/${user.id}/photos`}
                        className="user-profile__photos-link"
                    >
                        <svg 
                            className="user-profile__photos-icon" 
                            viewBox="0 0 24 24"
                        >
                            <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                        </svg>
                        View Photo Gallery
                    </Link>
                </div>
            </div>
            
            <hr className="user-page__divider" />
            
            <PhotoPreviewStrip
                isAccessToEdit={isAccessToEdit}
                context={"user"}
                contextId={user.id}
                additionalActions={userActions}
                maxPhotos={8}
            />
            
            <hr className="user-page__divider" />
            
            <div className="user-profile__rated-movies">
                <RatedMoviesList userId={user.id} />
            </div>
        </div>
    );
}

export default UserData;