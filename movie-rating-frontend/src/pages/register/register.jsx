import NavigationBar from "../../components/navigation/navigation-bar/navigation-bar";
import RegisterForm from "../../components/auth/register-form/register-form";

export default function Register() {

    return (
        <>
            <NavigationBar />

            <div>
                <h1>Register Page</h1>
            </div>

            <div className="page-content-container">
                <div className="page-content">
                    <div>
                        <RegisterForm />
                    </div>
                </div>
            </div>
        </>
    )
}