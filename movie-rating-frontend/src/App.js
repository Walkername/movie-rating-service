import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './pages/main-page/main-page';
import './App.css';
import UserPage from './pages/user-page/user-page';
import AddMoviePage from './pages/add-movie-page/add-movie-page';
import MoviePage from './pages/movie-page/movie-page';
import AddUserPage from './pages/add-user-page/add-user-page';
import Register from './pages/register/register';
import Login from './pages/login/login';
import AdminRoute from './utils/admin-route/admin-route';
import PrivateRoute from './utils/private-route/private-route';
import AdminPage from './pages/admin-page/admin-page';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<AdminRoute />}>
          <Route path="/movies/add" element={<AddMoviePage />} />
          <Route path="/users/add" element={<AddUserPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Route>
        <Route path="/user/:id" element={<UserPage />} />
        <Route path="/" element={<MainPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/movies/:id" element={<MoviePage />} />

        <Route path=""></Route>
      </Routes>
    </Router>
  );
}

export default App;
