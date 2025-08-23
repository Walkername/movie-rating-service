import { Link, useNavigate } from "react-router-dom";
import getClaimFromToken from "../../../utils/token-validation/token-validation";
import SearchField from "../search-field/search-field";

function NavigationBar() {
    const navigate = useNavigate();
    const token = localStorage.getItem("accessToken");
    // const exp = getClaimFromToken(token, "exp");
    const id = getClaimFromToken(token, "id");
    const role = getClaimFromToken(token, "role");
    // const authStatus = Date.now() / 1000 <= exp;
    const adminStatus = role === "ADMIN";

    const handleClick = (target) => {
        navigate(target);
    }

    const handleLogout = (e) => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        navigate("/login");
    }

    const links = [
        { text: "MOVIE CLUSTER", path: "/" }
    ];

    return (
        <nav>
            <span className="nav-bar-left">
                {links.map((link, index) => (
                    <Link
                        className="nav-element"
                        key={index}
                        to={link.path}
                    >
                        {link.text}
                    </Link>
                ))}
            </span>
            <SearchField />
            <span className="nav-bar-right">
                {
                    token ?
                        <Link
                            className="nav-element"
                            to={`/user/${id}`}
                        >Profile</Link>
                        : <></>
                }
                <span className="auth-buttons">
                    {
                        token ?
                            <>
                                {
                                    adminStatus
                                        ?
                                        <Link className="auth-button" to={"/admin"}>Admin</Link>
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