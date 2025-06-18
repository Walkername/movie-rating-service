import { useNavigate } from "react-router-dom";
import { deleteMovie } from "../../api/movie-api";

function DeleteButton({id}) {
    const navigate = useNavigate();
    const handleDelete = () => {
        deleteMovie(id)
            .then((data) => {
                console.log("Movie deleted successfully:", data);
                navigate("/");
            })
            .catch((error) => {
                console.error("Error:", error);
                alert("Error deleting movie");
            });
    }

    return (
        <div>
            <button onClick={handleDelete}>Delete</button>
        </div>
    );
}

export default DeleteButton;