
function MovieDetails({movie}) {
    return (
            <div>
                <div>
                    <h2>{movie.title} ({movie.releaseYear})</h2>
                </div>
                <h3>Description</h3>
                <div>
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
            </div>
        )
}

export default MovieDetails;