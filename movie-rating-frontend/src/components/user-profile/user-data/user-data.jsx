import { useEffect, useState } from "react";
import RatedMoviesList from "../rated-movies-list/rated-movies-list";
import { downloadFile } from "../../../api/file-api";
import "../../../styles/user-data.css";

function UserData({ user }) {

    const [profilePicUrl, setProfilePicUrl] = useState(null);

    useEffect(() => {
        if (!user.profilePicId) return;
        downloadFile(user.profilePicId)
            .then((data) => {
                setProfilePicUrl(data);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }, [user.profilePicUrl]);

    return (
        <div>
            <div className="user-info">
                <img
                    className="profile-pic"
                    src={profilePicUrl || "/default-avatar.png"}
                    alt="Profile"
                />
                <div>
                    <h2 className="username">{user.username}</h2>

                    <h3 className="section-title">Description</h3>
                    <p className="section-text">{user.description || "No description provided"}</p>

                    <h3 className="section-title">Average rating</h3>
                    <p className="section-text">{user.averageRating ?? "N/A"}</p>

                    <h3 className="section-title">Scores</h3>
                    <p className="section-text">{user.scores}</p>
                </div>
            </div>

            <div className="rated-movies">
                <RatedMoviesList userId={user.id} />
            </div>
        </div>
    );
}

export default UserData;