import { Link, useNavigate } from "react-router-dom";
import getClaimFromToken from "../../../utils/token-validation/token-validation";
import SearchField from "../search-field/search-field";
import "./navigation-bar.css";

function NavigationBar() {
    const navigate = useNavigate();
    const token = localStorage.getItem("accessToken");
    const id = token ? getClaimFromToken(token, "id") : null;
    const role = token ? getClaimFromToken(token, "role") : null;
    const adminStatus = role === "ADMIN";

    const handleLogout = (e) => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        navigate("/login");
    }

    return (
        <nav className="nav">
            <div className="nav__left">
                <Link
                    className="nav__link nav__link--brand"
                    to="/"
                >
                    MOVIE CLUSTER
                </Link>
            </div>
            
            <div className="nav__search">
                <SearchField />
            </div>
            
            <div className="nav__right">
                {token && (
                    <Link
                        className="nav__link nav__link--profile"
                        to={`/user/${id}`}
                    >
                        Profile
                    </Link>
                )}
                
                <div className="nav__auth-buttons">
                    {token ? (
                        <>
                            {adminStatus && (
                                <button 
                                    className="nav__auth-button nav__auth-button--admin"
                                    onClick={() => navigate("/admin")}
                                >
                                    Admin
                                </button>
                            )}
                            <button 
                                className="nav__auth-button nav__auth-button--logout"
                                onClick={handleLogout}
                            >
                                Log out
                            </button>
                        </>
                    ) : (
                        <>
                            <button 
                                className="nav__auth-button"
                                onClick={() => navigate("/register")}
                            >
                                Register
                            </button>
                            <button 
                                className="nav__auth-button"
                                onClick={() => navigate("/login")}
                            >
                                Login
                            </button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default NavigationBar;