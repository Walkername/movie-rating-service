
function MovieCard({ movie, index, handleNavigate }) {
    let href = "/movies/" + movie.id;
    return (
        <div key={index} className="movie-card" onClick={() => handleNavigate(href)}>
            <div className="movie-card-header">
                <span className="movie-card-title"><b>{movie.title} ({movie.releaseYear})</b></span>
                <span className="movie-card-rating">{movie.averageRating}</span>
            </div>
            <span style={{ color: "#FF0000" }}></span>
            <p className="movie-card-description">{movie.description}</p>
        </div>
    );
}

export default MovieCard;
