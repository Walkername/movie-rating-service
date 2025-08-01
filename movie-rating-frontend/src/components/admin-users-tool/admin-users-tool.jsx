import { useState } from "react";
import { getUser, getUserByUsername } from "../../api/user-api";
import NavigationBar from "../navigation/navigation";
import { useNavigate } from "react-router-dom";
import UserDataEdit from "../user-data-edit/user-data-edit";

function AdminUsersTool() {
    const navigate = useNavigate();

    const handleNavigate = (target) => {
        navigate(target);
    }

    const token = localStorage.getItem("token");
    const [idToSend, setIdToSend] = useState("");
    const [usernameToSend, setUsernameToSend] = useState("");

    const [statusMessage, setStatusMessage] = useState("");

    const [user, setUser] = useState(null);

    const handleIdInput = (e) => {
        setIdToSend(e.target.value);
    }

    const handleUsernameInput = (e) => {
        setUsernameToSend(e.target.value);
    }

    const handleGetUserById = (e) => {
        e.preventDefault();

        getUser(idToSend)
            .then((data) => {
                setUser(data);
            })
            .catch(() => {
                setUser(null);
                setStatusMessage("Such user was not found");
            })
    }

    const handleGetUserByUsername = (e) => {
        e.preventDefault();

        getUserByUsername(usernameToSend)
            .then((data) => {
                setUser(data);
            })
            .catch(() => {
                setUser(null);
                setStatusMessage("Such user was not found");
            })
    }

    return (
        <>
            <NavigationBar />
            <div>
                <h1>Admin Tools</h1>
            </div>
            <div className="page-content-container">
                <div className="page-content">
                    <div className="admin-content">
                        <div className="admin-toolbar">
                            <button
                                onClick={() => handleNavigate("/admin/users-tool")}
                            >Users</button>
                            <button
                                onClick={() => handleNavigate("/admin/movies-tool")}
                            >Movies</button>
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
                                                <h2 className="username-link" onClick={() => handleNavigate(`/user/${user.id}`)}>{user.username}</h2>
                                                <p className="user-info-fa-description">{user.description}</p>
                                                <p>Average rating: {user.averageRating}</p>
                                                <p>Scores: {user.scores}</p>
                                            </div>
                                            <UserDataEdit user={user} setUser={setUser} />
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