import { useNavigate } from "react-router-dom";

import {deleteMovie} from "../../../api/admin-movie-api";

function DeleteButton({id}) {
    const navigate = useNavigate();
    const handleDelete = () => {
        deleteMovie(id)
            .then(() => {
                navigate("/");
            })
            .catch((error) => {
                console.error("Error:", error);
                alert("Error deleting movie");
            });
    }

    return (
        <div>
            <button className="edit-btn" onClick={handleDelete}>Delete</button>
        </div>
    );
}

export default DeleteButton;