import { useParams } from "react-router-dom";
import NavigationBar from "../../components/navigation/navigation-bar/navigation-bar";
import MovieDetails from "../../components/movie/movie-details/movie-details";
import RateMovie from "../../components/movie/rate-movie/rate-movie";
import DeleteButton from "../../components/movie/delete-button/delete-button";
import { useEffect, useState } from "react";
import { getMovie } from "../../api/movie-api";
import MovieDetailsEdit from "../../components/movie/movie-details-edit/movie-details-edit";
import getClaimFromToken from "../../utils/token-validation/token-validation";

function MoviePage() {
    const { id } = useParams(); // Get the movie ID from the URL parameters
    const [movie, setMovie] = useState(null); // State for the movie data
    const token = localStorage.getItem("accessToken");
    let isAccessToEdit = false;
    if (token != null) {
        const tokenRole = getClaimFromToken(token, "role");
        isAccessToEdit = tokenRole === "ADMIN";
    }

    useEffect(() => {
        getMovie(id)
            .then((data) => {
                setMovie(data); // Set the movie data
            })
            .catch((error) => {
                console.error(error);
            });
    }, [id]); // this runs whenever `id` changes

    // Handle edit button
    const [isEditing, setIsEditing] = useState(false);

    const handleEdit = () => {
        setIsEditing(!isEditing);
    }

    return (
        <>
            <NavigationBar />
            <div className="page-content-container">
                <div className="page-content">
                    {
                        movie == null
                            ? <h1>Error: Movie was not found</h1>
                            : <div>
                                {
                                    !isEditing
                                        ? (
                                            <>
                                                <MovieDetails movie={movie} />
                                                <RateMovie movieId={id} isAccessToEdit={isAccessToEdit} />
                                            </>
                                        )
                                        : (
                                            isAccessToEdit
                                                ?
                                                <>
                                                    <DeleteButton id={id} />
                                                    <MovieDetailsEdit movie={movie} />
                                                </>
                                                :
                                                <></>
                                        )

                                }
                            </div>
                    }
                    {
                        isAccessToEdit
                            ?
                            <div>
                                <button onClick={handleEdit}>
                                    {isEditing ? "Back" : "Edit"}
                                </button>
                            </div>
                            :
                            <></>
                    }

                </div>
            </div>

        </>
    );
}

export default MoviePage;