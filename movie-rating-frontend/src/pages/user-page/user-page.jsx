import NavigationBar from "../../components/navigation/navigation-bar/navigation-bar";
import UserDataEdit from "../../components/user-profile/user-data-edit/user-data-edit";
import UserData from "../../components/user-profile/user-data/user-data";
import { useEffect, useState } from 'react';
import getClaimFromToken from "../../utils/token-validation/token-validation";
import { getUser } from "../../api/user-api";
import { useParams } from "react-router-dom";
import "./user-page.css";

function UserPage() {
    const { id } = useParams();

    const [isEditing, setIsEditing] = useState(false);
    const token = localStorage.getItem("accessToken");
    let isAccessToEdit = false;
    if (token != null) {
        const tokenId = getClaimFromToken(token, "id");
        const tokenRole = getClaimFromToken(token, "role");
        isAccessToEdit = parseInt(id) === parseInt(tokenId) || tokenRole === "ADMIN";
    }

    const [user, setUser] = useState(null);

    useEffect(() => {
        getUser(id)
            .then((data) => {
                setUser(data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [id]);

    const handleEdit = () => {
        setIsEditing(!isEditing);
    };

    return (
        <>
            <NavigationBar />
            <div className="background-page">
                <h1 className="profile-title">User Profile</h1>
                <div className="profile-card">
                    {
                        user == null
                            ? <h1 className="error-text">Error: Data was not found</h1>
                            : <>
                                {isEditing
                                    ? (isAccessToEdit && (
                                        <UserDataEdit
                                            isAccessToEdit={isAccessToEdit}
                                            user={user}
                                            setUser={setUser}
                                            handleEdit={handleEdit}
                                        />
                                    ))
                                    : <UserData
                                        isAccessToEdit={isAccessToEdit}
                                        user={user}
                                        handleEdit={handleEdit}
                                    />
                                }
                            </>
                    }
                </div>
            </div>
        </>
    );
}

export default UserPage;