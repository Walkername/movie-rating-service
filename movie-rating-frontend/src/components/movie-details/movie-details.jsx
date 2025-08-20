import validateDate from "../../utils/date-validation/date-validation";

function MovieDetails({ movie }) {
    return (
        <>
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
            <div
                style={{
                    fontSize: "12px",
                }}
            >
                Created at: {validateDate(movie.createdAt)}
            </div>
        </>
    )
}

export default MovieDetails;