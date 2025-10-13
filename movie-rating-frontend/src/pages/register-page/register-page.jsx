import NavigationBar from "../../components/navigation/navigation-bar/navigation-bar";
import RegisterForm from "../../components/auth/register-form/register-form";
import "./register-page.css";

export default function RegisterPage() {

    return (
        <>
            <NavigationBar />

            <div className="background-page">
                <h1>Register Page</h1>
                <div className="register-form-container">
                    <RegisterForm />
                </div>
            </div>
        </>
    );
}