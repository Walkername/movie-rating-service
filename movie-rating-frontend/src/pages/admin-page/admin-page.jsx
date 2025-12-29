import NavigationBar from "../../components/navigation/navigation-bar/navigation-bar";
import { Outlet } from "react-router-dom";
import "./admin-page.css";
import AdminToolBar from "../../components/admin-tools/admin-tool-bar/admin-tool-bar";

export default function AdminPage() {
    return (
        <>
            <NavigationBar />
            <div className="background-page">
                <h1>Admin Tools</h1>
                <div className="profile-card">
                    <div className="admin-content">
                        <AdminToolBar />
                        
                        <Outlet />
                    </div>
                </div>
            </div>

        </>
    );
}