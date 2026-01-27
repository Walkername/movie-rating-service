import NavigationBar from "../../components/navigation/navigation-bar/navigation-bar";
import UserDataEdit from "../../components/user-profile/user-data-edit/user-data-edit";
import UserData from "../../components/user-profile/user-data/user-data";
import { useEffect, useState } from "react";
import getClaimFromToken from "../../utils/token-validation/token-validation";
import { getUser } from "../../api/user-api";
import { useParams } from "react-router-dom";
import "./user-page.css";

function UserPage() {
    const { id } = useParams();
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const token = localStorage.getItem("accessToken");
    let isAccessToEdit = false;
    let currentUserId = null;

    if (token != null) {
        try {
            const tokenId = getClaimFromToken(token, "id");
            const tokenRole = getClaimFromToken(token, "role");
            currentUserId = parseInt(tokenId);
            isAccessToEdit =
                parseInt(id) === currentUserId || tokenRole === "ADMIN";
        } catch (error) {
            console.error("Token parsing error:", error);
        }
    }

    const [user, setUser] = useState(null);

    useEffect(() => {
        setIsLoading(true);
        setError(null);

        getUser(id)
            .then((data) => {
                setUser(data);
                // Можно добавить логику для определения последней активности
                // setLastActive(new Date(data.lastActiveAt));
                setIsLoading(false);
            })
            .catch((error) => {
                console.error("Error loading user:", error);
                setError("User not found or error loading data");
                setIsLoading(false);
            });
    }, [id]);

    const handleEdit = () => {
        setIsEditing(!isEditing);
    };

    const handleUserUpdate = (updatedUser) => {
        setUser(updatedUser);
    };

    // Определяем статус пользователя (заглушка)
    const isUserOnline = false; // Здесь можно добавить реальную логику

    return (
        <div className="user-page">
            <NavigationBar />

            <div className="user-page__content">
                <div className="user-page__card">
                    {isLoading ? (
                        <div className="user-page__loading">
                            <div className="user-page__spinner"></div>
                            <p>Loading user profile...</p>
                        </div>
                    ) : error ? (
                        <div className="user-page__error">
                            <h2>Error: User was not found</h2>
                            <p>
                                The user profile you're looking for doesn't
                                exist or cannot be loaded.
                            </p>
                        </div>
                    ) : user ? (
                        <>
                            <div className="user-page__header">
                                <h1 className="user-page__title">
                                    User Profile
                                </h1>
                                <p className="user-page__subtitle">
                                    Member since{" "}
                                    {new Date(user.createdAt).getFullYear()}
                                </p>
                            </div>

                            {isUserOnline && (
                                <div className="user-page__status">
                                    <div className="user-page__status-dot"></div>
                                    <span>Online</span>
                                </div>
                            )}

                            {isEditing ? (
                                isAccessToEdit && (
                                    <UserDataEdit
                                        isAccessToEdit={isAccessToEdit}
                                        user={user}
                                        setUser={handleUserUpdate}
                                        handleEdit={handleEdit}
                                    />
                                )
                            ) : (
                                <UserData
                                    isAccessToEdit={isAccessToEdit}
                                    user={user}
                                    handleEdit={handleEdit}
                                    currentUserId={currentUserId}
                                />
                            )}
                        </>
                    ) : null}
                </div>
            </div>
        </div>
    );
}

export default UserPage;
