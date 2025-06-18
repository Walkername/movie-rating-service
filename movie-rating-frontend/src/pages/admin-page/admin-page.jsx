import { useState } from "react";
import { getUser, getUserByUsername } from "../../api/user-api";
import NavigationBar from "../../components/navigation/navigation";
import UserData from "../../components/user-data/user-data";

export default function AdminPage() {
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
                        <button>Delete account</button>
                        <div>
                            {
                                user
                                    ?
                                    <UserData user={user} />
                                    :
                                    <div>{statusMessage}</div>
                            }
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
}