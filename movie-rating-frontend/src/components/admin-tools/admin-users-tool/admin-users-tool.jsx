import { useEffect, useState } from "react";
import { getUser, getUserByUsername } from "../../../api/user-api";
import NavigationBar from "../../navigation/navigation-bar/navigation-bar";
import { Link, useNavigate } from "react-router-dom";
import AdminUserDataEdit from "../admin-user-data-edit/admin-user-data-edit";
import { downloadFile } from "../../../api/file-api";
import "./admin-users-tool.css";

function AdminUsersTool() {
    const navigate = useNavigate();

    const handleNavigate = (target) => {
        navigate(target);
    }

    const [idToSend, setIdToSend] = useState("");
    const [usernameToSend, setUsernameToSend] = useState("");

    const [statusMessage, setStatusMessage] = useState("");

    const [user, setUser] = useState(null);

    const handleIdInput = (e) => {
        setIdToSend(e.target.value);
    };

    const handleUsernameInput = (e) => {
        setUsernameToSend(e.target.value);
    };

    const handleGetUserById = (e) => {
        e.preventDefault();

        getUser(idToSend)
            .then((data) => {
                setUser(data);
            })
            .catch(() => {
                setUser(null);
                setStatusMessage("Such user was not found");
            });
    };

    const handleGetUserByUsername = (e) => {
        e.preventDefault();

        getUserByUsername(usernameToSend)
            .then((data) => {
                setUser(data);
            })
            .catch(() => {
                setUser(null);
                setStatusMessage("Such user was not found");
            });
    };

    // DOWNLOAD PROFILE PICTURE
    const [profilePicUrl, setProfilePicUrl] = useState(null);

    useEffect(() => {
        if (!user) return;
        if (!user.profilePicId) return;
        downloadFile(user.profilePicId)
            .then((data) => {
                setProfilePicUrl(data);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }, [user]);

    return (
        <>
            <NavigationBar />

            <div className="background-page">
                <h1>Admin Tools</h1>
                <div className="profile-card">
                    <div className="admin-content">
                        <div className="admin-toolbar">
                            <button
                                onClick={() => handleNavigate("/admin/users-tool")}
                            >
                                Users
                            </button>
                            <button
                                onClick={() => handleNavigate("/admin/movies-tool")}
                            >
                                Movies
                            </button>
                        </div>
                        <div>
                            <div>You can find user:</div>
                            <form onSubmit={handleGetUserById}>
                                <label>By id: </label>
                                <input type="text" value={idToSend} onChange={handleIdInput} />{" "}
                                <input type="submit" value="Get" />
                            </form>
                            <br></br>
                            <form onSubmit={handleGetUserByUsername}>
                                <label>By username: </label>
                                <input type="text" value={usernameToSend} onChange={handleUsernameInput} />{" "}
                                <input type="submit" value="Get" />
                            </form>
                            <hr></hr>

                            <br></br>

                            <div>
                                {
                                    user
                                        ?
                                        <div className="user-info-fa">
                                            <div>
                                                {
                                                    profilePicUrl &&
                                                    <img
                                                        className="profile-pic"
                                                        src={profilePicUrl}
                                                        alt="Profile"
                                                    />
                                                }
                                                <h2>
                                                    <Link className="username-link" to={`/user/${user.id}`}>{user.username}</Link>
                                                </h2>
                                                <p className="user-info-fa-description">{user.description}</p>
                                                <p>Average rating: {user.averageRating}</p>
                                                <p>Scores: {user.scores}</p>
                                            </div>
                                            <AdminUserDataEdit user={user} setUser={setUser} />
                                        </div>
                                        :
                                        <div>{statusMessage}</div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
}

export default AdminUsersTool;