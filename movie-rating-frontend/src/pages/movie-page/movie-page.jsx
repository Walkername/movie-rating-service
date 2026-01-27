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
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const token = localStorage.getItem("accessToken");
    let isAccessToEdit = false;
    if (token != null) {
        const tokenRole = getClaimFromToken(token, "role");
        isAccessToEdit = tokenRole === "ADMIN";
    }

    useEffect(() => {
        setIsLoading(true);
        getMovie(id)
            .then((data) => {
                setMovie(data);
                setError(null);
            })
            .catch((error) => {
                console.error("Error fetching movie:", error);
                setError("Movie not found or error loading data");
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [id]);

    // Handle edit button
    const [isEditing, setIsEditing] = useState(false);

    const handleEdit = () => {
        setIsEditing(!isEditing);
    };

    // PhotoPreviewStrip
    const setMoviePoster = (photo) => {
        updateMoviePoster(id, photo.fileId)
            .then(() => {
                // Обновляем данные фильма после смены постера
                return getMovie(id);
            })
            .then((data) => {
                setMovie(data);
            })
            .catch((error) => {
                console.error("Error updating poster:", error);
            });
    };

    const movieActions = [
        {
            label: "Set as Movie Poster",
            handler: setMoviePoster,
        },
    ];

    return (
        <div className="movie-page">
            <NavigationBar />

            <div className="movie-page__content">
                <div className="movie-page__card">
                    {isLoading ? (
                        <div className="movie-page__loading">
                            <div className="movie-page__spinner"></div>
                            <p>Loading movie details...</p>
                        </div>
                    ) : error ? (
                        <div className="movie-page__error">
                            <h2>Error: Movie was not found</h2>
                            <p>
                                The movie you're looking for doesn't exist or
                                cannot be loaded.
                            </p>
                        </div>
                    ) : movie ? (
                        <>
                            {!isEditing ? (
                                <>
                                    <MovieDetails
                                        isAccessToEdit={isAccessToEdit}
                                        movie={movie}
                                        handleEdit={handleEdit}
                                    />

                                    <hr className="movie-page__divider" />

                                    <PhotoPreviewStrip
                                        isAccessToEdit={isAccessToEdit}
                                        context={"movie"}
                                        contextId={movie.id}
                                        addionalActions={movieActions}
                                    />

                                    <hr className="movie-page__divider" />

                                    <RateMovie
                                        movieId={id}
                                        isAccessToEdit={isAccessToEdit}
                                    />
                                </>
                            ) : (
                                isAccessToEdit && (
                                    <MovieDetailsEdit
                                        isAccessToEdit={isAccessToEdit}
                                        movie={movie}
                                        handleEdit={handleEdit}
                                    />
                                )
                            )}
                        </>
                    ) : null}
                </div>
            </div>
        </div>
    );
}

export default MoviePage;
