import { useEffect, useState } from "react";
import validateDate from "../../../utils/date-validation/date-validation";
import { downloadFile } from "../../../api/file-api";
import "../../../styles/movie-details.css";
import unknownMoviePoster from "../../../assets/images/unknown-movie-poster.png";

function MovieDetails({ movie }) {
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
            <div>
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
        </div>
    )
}

export default MovieDetails;