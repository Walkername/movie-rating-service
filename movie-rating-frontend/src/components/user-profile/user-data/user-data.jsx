import { useEffect, useState } from "react";
import RatedMoviesList from "../rated-movies-list/rated-movies-list";
import { downloadFile } from "../../../api/file-api";
import "../../../styles/user-data.css";
import unknownProfilePic from "../../../assets/images/unknown-profile-avatar.png";
import PhotoPreviewStrip from "../../photo-preview-strip/photo-preview-strip";
import getClaimFromToken from "../../../utils/token-validation/token-validation";
import { updateMyProfilePictureId } from "../../../api/user-api";

function UserData({ user }) {
    const token = localStorage.getItem("accessToken");
    const tokenId = getClaimFromToken(token, "id");
    const isAccessToEdit = user.id == tokenId;

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

    // PhotoPreviewStrip
    const setProfilePicture = (photo) => {
        updateMyProfilePictureId(photo.fileId);
    };

    const userActions = [
        {
            label: "Set as Profile Picture",
            handler: setProfilePicture
        }
    ];

    return (
        <div>
            <div className="user-info">
                <img
                    className="profile-pic"
                    src={profilePicUrl || unknownProfilePic}
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

            <PhotoPreviewStrip
                isAccessToEdit={isAccessToEdit}
                context={"user"}
                contextId={user.id}
                addionalActions={userActions}
            />

            <div className="rated-movies">
                <RatedMoviesList userId={user.id} />
            </div>
        </div>
    );
}

export default UserData;