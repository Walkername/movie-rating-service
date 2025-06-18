import { Navigate, Outlet } from "react-router-dom";
import getClaimFromToken from "../token-validation/token-validation";

export default function PrivateRoute() {
    const token = localStorage.getItem("token");
    const exp = getClaimFromToken(token, "exp");
    const authStatus = Date.now() / 1000 <= exp;
    console.log("Auth Status:", authStatus);

    return (
        authStatus ? <Outlet /> : <Navigate to="/login" />
    )
}