import LoginForm from "../../components/login-form/login-form";
import NavigationBar from "../../components/navigation/navigation";

export default function Login() {


    return (
        <>
            <NavigationBar />

            <div>
                <h1>Login Page</h1>
            </div>

            <div className="page-content-container">
                <div className="page-content">
                    <div>
                        <LoginForm />
                    </div>
                </div>
            </div>
        </>
    )
}