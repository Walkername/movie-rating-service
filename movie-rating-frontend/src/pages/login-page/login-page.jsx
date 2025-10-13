import LoginForm from "../../components/auth/login-form/login-form";
import NavigationBar from "../../components/navigation/navigation-bar/navigation-bar";
import "./login-page.css";

export default function LoginPage() {


    return (
        <>
            <NavigationBar />

            <div className="background-page">
                <h1>Login Page</h1>
                <div className="login-form-container">
                    <LoginForm />
                </div>
            </div>
        </>
    );
}