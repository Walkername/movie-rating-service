import NavigationBar from "../../components/navigation/navigation-bar/navigation-bar";
import { useNavigate } from "react-router-dom";
import "./admin-page.css";

export default function AdminPage() {
    const navigate = useNavigate();

    const handleNavigate = (target) => {
        navigate(target);
    }

    return (
        <>
            <NavigationBar />
            <div className="background-page">
                <h1>Admin Tools</h1>
                <div className="profile-card">
                    <div className="admin-content">
                        <div className="admin-toolbar">
                            <button
                                onClick={() => handleNavigate("./users-tool")}
                            >Users</button>
                            <button
                                onClick={() => handleNavigate("./movies-tool")}
                            >Movies</button>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
}