import LoginForm from "../../components/auth/login-form/login-form";
import NavigationBar from "../../components/navigation/navigation-bar/navigation-bar";
import { Link } from "react-router-dom";
import "./login-page.css";

export default function LoginPage() {
    return (
        <div className="login-page">
            <NavigationBar />
            
            <div className="login-page__content">
                <div className="login-page__form-container">
                    <h1 className="login-page__title">Welcome Back</h1>
                    <LoginForm />
                    
                    <div className="login-page__extra-links">
                        <Link to="/forgot-password" className="login-page__forgot-password">
                            Forgot Password?
                        </Link>
                        <div className="login-page__register-link">
                            Don't have an account? <Link to="/register">Sign Up</Link>
                        </div>
                    </div>
                    
                    {/* Опционально: социальный вход
                    <div className="login-page__social">
                        <div className="login-page__social-title">Or continue with</div>
                    </div>
                    */}
                </div>
            </div>
        </div>
    );
}