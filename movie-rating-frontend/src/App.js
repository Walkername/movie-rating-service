import {
    BrowserRouter as Router,
    Navigate,
    Route,
    Routes,
} from "react-router-dom";
import MainPage from "./pages/main-page/main-page";
import "./App.css";
import UserPage from "./pages/user-page/user-page";
import MoviePage from "./pages/movie-page/movie-page";
import AdminRoute from "./utils/admin-route/admin-route";
import AdminPage from "./pages/admin-page/admin-page";
import AdminUsersTool from "./components/admin-tools/admin-users-tool/admin-users-tool";
import AdminMoviesTool from "./components/admin-tools/admin-movies-tool/admin-movies-tool";
import UserPhotoCatalog from "./pages/user-photo-catalog/user-photo-catalog";
import MoviePhotoCatalog from "./pages/movie-photo-catalog/movie-photo-catalog";
import LoginPage from "./pages/login-page/login-page";
import RegisterPage from "./pages/register-page/register-page";
import FeedPage from "./pages/feed-page/feed-page";
import AdminPostsTool from "./components/admin-tools/admin-posts-tool/admin-posts-tool";
import ScrollToTop from "./utils/scroll-reset/scroll-to-top";
import AdminPostUpdate from "./pages/admin-post-update/admin-post-update";
import NotificationSystem from "./components/notification-system/notification-system";
import { useAuth } from "./utils/auth-hook/use-auth";
import SupportPage from "./pages/support-page/support-page";

function App() {
    const isAuthenticated = useAuth();

    return (
        <Router>
            <ScrollToTop />
            <Routes>
                <Route element={<AdminRoute />}>
                    <Route path="/admin" element={<AdminPage />}>
                        <Route
                            index
                            element={<Navigate to="users-tool" replace />}
                        />
                        <Route path="users-tool" element={<AdminUsersTool />} />
                        <Route
                            path="movies-tool"
                            element={<AdminMoviesTool />}
                        />
                        <Route path="posts-tool" element={<AdminPostsTool />} />
                    </Route>
                    <Route
                        path="admin/posts/update/:id"
                        element={<AdminPostUpdate />}
                    />
                </Route>
                <Route path="/" element={<MainPage />} />
                <Route path="/user/:id" element={<UserPage />} />
                <Route path="/user/:id/photos" element={<UserPhotoCatalog />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/movie/:id" element={<MoviePage />} />
                <Route
                    path="/movie/:id/photos"
                    element={<MoviePhotoCatalog />}
                />
                <Route path="/feed" element={<FeedPage />} />
                <Route path="/support" element={<SupportPage />} />

                <Route path=""></Route>
            </Routes>

            {isAuthenticated && <NotificationSystem />}
        </Router>
    );
}

export default App;
