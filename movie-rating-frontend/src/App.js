import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './pages/main-page/main-page';
import './App.css';
import UserPage from './pages/user-page/user-page';
import MoviePage from './pages/movie-page/movie-page';
import AdminRoute from './utils/admin-route/admin-route';
import AdminPage from './pages/admin-page/admin-page';
import AdminUsersTool from './components/admin-tools/admin-users-tool/admin-users-tool';
import AdminMoviesTool from './components/admin-tools/admin-movies-tool/admin-movies-tool';
import UserPhotoCatalog from './pages/user-photo-catalog/user-photo-catalog';
import MoviePhotoCatalog from './pages/movie-photo-catalog/movie-photo-catalog';
import LoginPage from './pages/login-page/login-page';
import RegisterPage from './pages/register-page/register-page';
import FeedPage from './pages/feed-page/feed-page';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/users-tool" element={<AdminUsersTool />} />
          <Route path="/admin/movies-tool" element={<AdminMoviesTool />} />
        </Route>
        <Route path="/" element={<MainPage />} />
        <Route path="/user/:id" element={<UserPage />} />
        <Route path="/user/:id/photos" element={<UserPhotoCatalog />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/movie/:id" element={<MoviePage />} />
        <Route path="/movie/:id/photos" element={<MoviePhotoCatalog />} />
        <Route path="/feed" element={<FeedPage />} />
        <Route path=""></Route>
      </Routes>
    </Router>
  );
}

export default App;
