import { useParams } from "react-router-dom";
import NavigationBar from "../../components/navigation/navigation-bar/navigation-bar";
import MovieDetails from "../../components/movie/movie-details/movie-details";
import RateMovie from "../../components/movie/rate-movie/rate-movie";
import { useEffect, useState } from "react";
import { getMovie } from "../../api/movie-api";
import MovieDetailsEdit from "../../components/movie/movie-details-edit/movie-details-edit";
import getClaimFromToken from "../../utils/token-validation/token-validation";
import PhotoPreviewStrip from "../../components/photo-preview-strip/photo-preview-strip";
import { updateMoviePoster } from "../../api/admin-movie-api";
import "./movie-page.css";

function MoviePage() {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const token = localStorage.getItem("accessToken");
    let isAccessToEdit = false;
    if (token != null) {
        const tokenRole = getClaimFromToken(token, "role");
        isAccessToEdit = tokenRole === "ADMIN";
    }

    useEffect(() => {
        getMovie(id)
            .then((data) => {
                setMovie(data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [id]);

    // Handle edit button
    const [isEditing, setIsEditing] = useState(false);

    const handleEdit = () => {
        setIsEditing(!isEditing);
    }

    // PhotoPreviewStrip
    const setMoviePoster = (photo) => {
        updateMoviePoster(id, photo.fileId);
    };

    const movieActions = [
        {
            label: "Set as Movie Poster",
            handler: setMoviePoster
        }
    ];

    return (
        <>
            <NavigationBar />
            <div className="background-page">
                <div className="profile-card">
                    {
                        movie == null
                            ? <h1>Error: Movie was not found</h1>
                            : <>
                                {
                                    !isEditing
                                        ? (
                                            <>
                                                <MovieDetails isAccessToEdit={isAccessToEdit} movie={movie} handleEdit={handleEdit} />
                                                <PhotoPreviewStrip
                                                    isAccessToEdit={isAccessToEdit}
                                                    context={"movie"}
                                                    contextId={movie.id}
                                                    addionalActions={movieActions}
                                                />
                                                <RateMovie movieId={id} isAccessToEdit={isAccessToEdit} />
                                            </>
                                        )
                                        : (
                                            isAccessToEdit && <MovieDetailsEdit isAccessToEdit={isAccessToEdit} movie={movie} handleEdit={handleEdit} />
                                        )

                                }
                            </>
                    }
                </div>
            </div>

        </>
    );
}

export default MoviePage;