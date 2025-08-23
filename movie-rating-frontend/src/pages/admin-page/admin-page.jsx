import { useState } from "react";
import { getUser, getUserByUsername } from "../../api/user-api";
import NavigationBar from "../../components/navigation/navigation-bar/navigation-bar";
import UserData from "../../components/user-profile/user-data/user-data";
import { useNavigate } from "react-router-dom";

export default function AdminPage() {
    const navigate = useNavigate();

    const handleNavigate = (target) => {
        navigate(target);
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
                                onClick={() => handleNavigate("./users-tool")}
                            >Users</button>
                            <button
                                onClick={() => handleNavigate("./movies-tool")}
                            >Movies</button>
                        </div>
                        <div>
                            
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
}