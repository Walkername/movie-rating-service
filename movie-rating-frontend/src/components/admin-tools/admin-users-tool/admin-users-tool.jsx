import { useEffect, useState } from "react";
import { getUser, getUserByUsername } from "../../../api/user-api";
import { Link } from "react-router-dom";
import AdminUserDataEdit from "../admin-user-data-edit/admin-user-data-edit";
import { downloadFile } from "../../../api/file-api";
import "./admin-users-tool.css";

function AdminUsersTool() {
    const [idToSend, setIdToSend] = useState("");
    const [usernameToSend, setUsernameToSend] = useState("");
    const [statusMessage, setStatusMessage] = useState("");
    const [user, setUser] = useState(null);
    const [profilePicUrl, setProfilePicUrl] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [activeSearchMethod, setActiveSearchMethod] = useState("id"); // 'id' or 'username'

    const handleIdInput = (e) => {
        setIdToSend(e.target.value);
    };

    const handleUsernameInput = (e) => {
        setUsernameToSend(e.target.value);
    };

    const handleGetUserById = async (e) => {
        e.preventDefault();
        if (!idToSend.trim()) return;
        
        setIsLoading(true);
        setActiveSearchMethod("id");
        setUser(null);
        setStatusMessage("");
        
        try {
            const data = await getUser(idToSend);
            setUser(data);
            setStatusMessage("");
        } catch (error) {
            setUser(null);
            setStatusMessage("User not found. Please check the ID and try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGetUserByUsername = async (e) => {
        e.preventDefault();
        if (!usernameToSend.trim()) return;
        
        setIsLoading(true);
        setActiveSearchMethod("username");
        setUser(null);
        setStatusMessage("");
        
        try {
            const data = await getUserByUsername(usernameToSend);
            setUser(data);
            setStatusMessage("");
        } catch (error) {
            setUser(null);
            setStatusMessage("User not found. Please check the username and try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // DOWNLOAD PROFILE PICTURE
    useEffect(() => {
        if (!user) return;
        if (!user.profilePicId) {
            setProfilePicUrl(null);
            return;
        }
        
        downloadFile(user.profilePicId)
            .then((data) => {
                setProfilePicUrl(data);
            })
            .catch((error) => {
                console.error("Error loading profile picture:", error);
                setProfilePicUrl(null);
            });
    }, [user]);

    return (
        <div className="admin-users-tool">
            <div className="users-tool-header">
                <h2>User Management</h2>
                <p className="subtitle">Search and manage user accounts</p>
            </div>

            <div className="search-container">
                <div className="search-methods">
                    <div className="search-method-tabs">
                        <button
                            className={`tab-button ${activeSearchMethod === 'id' ? 'active' : ''}`}
                            onClick={() => setActiveSearchMethod('id')}
                        >
                            Search by ID
                        </button>
                        <button
                            className={`tab-button ${activeSearchMethod === 'username' ? 'active' : ''}`}
                            onClick={() => setActiveSearchMethod('username')}
                        >
                            Search by Username
                        </button>
                    </div>

                    <div className="search-forms">
                        {activeSearchMethod === 'id' ? (
                            <form onSubmit={handleGetUserById} className="search-form">
                                <div className="form-group">
                                    <label htmlFor="userId">User ID</label>
                                    <input
                                        id="userId"
                                        type="text"
                                        value={idToSend}
                                        onChange={handleIdInput}
                                        placeholder="Enter user ID..."
                                        className="search-input"
                                        disabled={isLoading}
                                    />
                                </div>
                                <button 
                                    type="submit" 
                                    className="search-button"
                                    disabled={!idToSend.trim() || isLoading}
                                >
                                    {isLoading ? 'Searching...' : 'Search User'}
                                    {isLoading && <span className="loading-spinner"></span>}
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleGetUserByUsername} className="search-form">
                                <div className="form-group">
                                    <label htmlFor="username">Username</label>
                                    <input
                                        id="username"
                                        type="text"
                                        value={usernameToSend}
                                        onChange={handleUsernameInput}
                                        placeholder="Enter username..."
                                        className="search-input"
                                        disabled={isLoading}
                                    />
                                </div>
                                <button 
                                    type="submit" 
                                    className="search-button"
                                    disabled={!usernameToSend.trim() || isLoading}
                                >
                                    {isLoading ? 'Searching...' : 'Search User'}
                                    {isLoading && <span className="loading-spinner"></span>}
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                {statusMessage && (
                    <div className={`status-message ${user ? 'success' : 'error'}`}>
                        {statusMessage}
                    </div>
                )}
            </div>

            <div className="user-results">
                {user ? (
                    <div className="user-card">
                        <div className="user-card-header">
                            <div className="user-avatar">
                                {profilePicUrl ? (
                                    <img
                                        className="profile-pic"
                                        src={profilePicUrl}
                                        alt={`${user.username}'s profile`}
                                    />
                                ) : (
                                    <div className="profile-pic-placeholder">
                                        {user.username.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>
                            <div className="user-basic-info">
                                <h3 className="username">
                                    <Link
                                        className="username-link"
                                        to={`/user/${user.id}`}
                                        target="_blank"
                                    >
                                        {user.username}
                                        <svg className="external-link-icon" viewBox="0 0 24 24" width="16" height="16">
                                            <path fill="currentColor" d="M18 19H6c-.55 0-1-.45-1-1V6c0-.55.45-1 1-1h5c.55 0 1-.45 1-1s-.45-1-1-1H5c-1.11 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-6c0-.55-.45-1-1-1s-1 .45-1 1v5c0 .55-.45 1-1 1zM14 4c0 .55.45 1 1 1h2.59l-9.13 9.13c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L19 6.41V9c0 .55.45 1 1 1s1-.45 1-1V4c0-.55-.45-1-1-1h-5c-.55 0-1 .45-1 1z"/>
                                        </svg>
                                    </Link>
                                </h3>
                                <div className="user-stats">
                                    <div className="stat">
                                        <span className="stat-label">ID:</span>
                                        <span className="stat-value">{user.id}</span>
                                    </div>
                                    <div className="stat">
                                        <span className="stat-label">Average Rating:</span>
                                        <span className="stat-value rating-value">{user.averageRating}</span>
                                    </div>
                                    <div className="stat">
                                        <span className="stat-label">Scores:</span>
                                        <span className="stat-value">{user.scores}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {user.description && (
                            <div className="user-description">
                                <h4>Description</h4>
                                <p className="description-text">{user.description}</p>
                            </div>
                        )}

                        <div className="user-edit-section">
                            <h4>Edit User Data</h4>
                            <AdminUserDataEdit user={user} setUser={setUser} />
                        </div>
                    </div>
                ) : (
                    statusMessage && (
                        <div className="no-user-found">
                            <div className="empty-state">
                                <svg className="empty-state-icon" viewBox="0 0 24 24" width="48" height="48">
                                    <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                                </svg>
                                <p>{statusMessage}</p>
                            </div>
                        </div>
                    )
                )}
            </div>
        </div>
    );
}

export default AdminUsersTool;