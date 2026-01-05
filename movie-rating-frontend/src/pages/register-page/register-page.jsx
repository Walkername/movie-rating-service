import NavigationBar from "../../components/navigation/navigation-bar/navigation-bar";
import RegisterForm from "../../components/auth/register-form/register-form";
import { Link } from "react-router-dom";
import "./register-page.css";

export default function RegisterPage() {
    return (
        <div className="register-page">
            <NavigationBar />
            
            <div className="register-page__content">
                <div className="register-page__form-container">
                    <h1 className="register-page__title">Join Movie Cluster</h1>
                    <RegisterForm />
                    
                    <div className="register-page__login-link">
                        Already have an account? <Link to="/login">Sign In</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}