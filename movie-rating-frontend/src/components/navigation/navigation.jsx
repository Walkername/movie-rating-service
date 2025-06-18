import { useNavigate } from "react-router-dom";
import getClaimFromToken from "../../utils/token-validation/token-validation";
import SearchField from "../search-field/search-field";

function NavigationBar() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const exp = getClaimFromToken(token, "exp");
    const id = getClaimFromToken(token, "id");
    const role = getClaimFromToken(token, "role");
    const authStatus = Date.now() / 1000 <= exp;
    const adminStatus = role === "ADMIN";

    const handleClick = (target) => {
        navigate(target);
    }

    const handleLogout = (e) => {
        localStorage.removeItem("token");
        navigate("/login");
    }

    const links = [
        { text: "MOVIE CLUSTER", path: "/" }
    ];

    return (
        <nav>
            <span className="nav-bar-left">
                {links.map((link, index) => (
                    <span
                        className="nav-element"
                        key={index}
                        onClick={
                            () => handleClick(link.path)}
                    >
                        {link.text}
                    </span>
                ))}
            </span>
            <SearchField />
            <span className="nav-bar-right">
                {
                    authStatus ?
                        <span
                            className="nav-element"
                            onClick={() => navigate(`/user/${id}`)}
                        >Profile</span>
                        : <></>
                }
                <span className="auth-buttons">
                    {
                        authStatus ?
                            <>
                                {
                                    adminStatus 
                                    ?
                                    <span className="auth-button" onClick={() => navigate("/admin")}>Admin</span>
                                    :
                                    <></>
                                }
                                
                                <span className="auth-button" onClick={handleLogout}>Log out</span>
                            </>
                            :
                            <>
                                <span className="auth-button" onClick={() => navigate("/register")}>Register</span>
                                <span className="auth-button" onClick={() => navigate("/login")}>Login</span>
                            </>

                    }
                </span>
            </span>


        </nav>
    )
}

export default NavigationBar;