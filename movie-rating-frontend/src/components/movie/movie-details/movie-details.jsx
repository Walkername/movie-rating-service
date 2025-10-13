import { useEffect, useState } from "react";
import validateDate from "../../../utils/date-validation/date-validation";
import { downloadFile } from "../../../api/file-api";
import "./movie-details.css";
import unknownMoviePoster from "../../../assets/images/unknown-movie-poster.png";

function MovieDetails({ isAccessToEdit, movie, handleEdit }) {
    const [posterPicUrl, setPosterPicUrl] = useState(null);

    useEffect(() => {
        if (!movie.posterPicId) return;
        downloadFile(movie.posterPicId)
            .then((data) => {
                setPosterPicUrl(data);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }, [movie.posterPicUrl]);

    return (
        <div className="movie-info">
            <img
                className="poster-pic"
                src={posterPicUrl || unknownMoviePoster}
                alt="Poster"
            />
            <div className="movie-info-right-side">
                <div className="movie-info-details">
                    <h2>{movie.title} ({movie.releaseYear})</h2>
                    <h3>Description</h3>
                    <div className="movie-description">
                        {movie.description}
                    </div>
                    <div>
                        <b>Release year:</b> {movie.releaseYear}
                    </div>
                    <div>
                        <b>Average rating:</b> {
                            movie.averageRating !== 0.0
                                ? movie.averageRating
                                : <span>no ratings</span>
                        }
                    </div>
                    <div>
                        <b>Scores:</b> {movie.scores}
                    </div>
                    <div style={{ fontSize: "12px", }}>
                        Created at: {validateDate(movie.createdAt)}
                    </div>
                </div>
                {
                    isAccessToEdit &&
                    <div>
                        <button className="edit-button" onClick={handleEdit}>
                            Edit
                        </button>
                    </div>
                }
            </div>
        </div>
    )
}

export default MovieDetails;