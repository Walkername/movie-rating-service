import { useState } from "react";
import { getUser, getUserByUsername } from "../../api/user-api";
import NavigationBar from "../navigation/navigation";
import { useNavigate } from "react-router-dom";
import AddMovieForm from "../add-movie-form/add-movie-form";

function AdminMoviesTool() {
    const navigate = useNavigate();

    const handleNavigate = (target) => {
        navigate(target);
    }

    return (
        <>
            <NavigationBar />
            <div>
                <h1>Admin Tools</h1>
            </div>
            <div className="page-content-container">
                <div className="page-content">
                    <div className="admin-content">
                        <div className="admin-toolbar">
                            <button
                                onClick={() => handleNavigate("/admin/users-tool")}
                            >Users</button>
                            <button
                                onClick={() => handleNavigate("/admin/movies-tool")}
                            >Movies</button>
                        </div>
                        <div>
                            <AddMovieForm />
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
}

export default AdminMoviesTool;