import { Navigate, Outlet } from "react-router-dom";
import getClaimFromToken from "../token-validation/token-validation";

export default function AdminRoute() {
    const token = localStorage.getItem("token");
    const adminAccess = getClaimFromToken(token, "role");

    return (
        adminAccess === "ADMIN" ? <Outlet /> : <Navigate to="/login" />
    )
}