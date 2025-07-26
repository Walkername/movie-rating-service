import { useEffect, useState } from "react";
import RatedMoviesList from "../rated-movies-list/rated-movies-list";
import { downloadFile } from "../../api/file-api";

function UserData({ user }) {

    const [profilePicUrl, setProfilePicUrl] = useState(null);

    useEffect(() => {
        if (!user.profilePicUrl) return;
        downloadFile(user.profilePicUrl)
            .then((data) => {
                setProfilePicUrl(data);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }, [user.profilePicUrl]);

    return (
        <div>
            <div style={{
                display: "flex",
                gap: "20px"
            }}>
                <img className="profile-pic" src={profilePicUrl} />

                <div>
                    <h2 style={{
                        margin: "0px"
                    }}>{user.username}</h2>

                    <h3>Description</h3>
                    <div>
                        {user.description}
                    </div>

                    <h3>Average rating</h3>
                    <div>
                        {user.averageRating}
                    </div>

                    <h3>Scores: {user.scores}</h3>
                </div>
            </div>

            <RatedMoviesList userId={user.id} />
        </div>
    )
}

export default UserData;