import NavigationBar from "../../components/navigation/navigation-bar/navigation-bar";
import { Outlet } from "react-router-dom";
import "./admin-page.css";
import AdminToolBar from "../../components/admin-tools/admin-tool-bar/admin-tool-bar";

export default function AdminPage() {
    return (
        <div className="admin-page">
            <NavigationBar />
            <div className="admin-content">
                <div className="admin-content__header">
                    <h1 className="admin-content__title">Admin Tools</h1>
                    <p className="admin-content__subtitle">
                        Manage users, movies, and posts with administrative privileges
                    </p>
                </div>
                <div className="profile-card">
                    <AdminToolBar />
                    <Outlet />
                </div>
            </div>
        </div>
    );
}