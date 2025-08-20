import { useEffect, useState } from "react";
import { getMoviesByUser } from "../../api/movie-api";
import validateDate from "../../utils/date-validation/date-validation";
import { useNavigate } from "react-router-dom";
import "../../styles/rated-movies-list.css";

function RatedMoviesList({ userId }) {
    const navigate = useNavigate();

    const [ratedMovies, setRatedMovies] = useState([]);

    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(10);
    const [sort, setSort] = useState("ratedAt:desc");

    useEffect(() => {
        getMoviesByUser(userId, page, limit, sort)
            .then((data) => {
                setRatedMovies(data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [userId, page, limit, sort]);

    return (
        <div className="rated-movies-container">
            <h3 className="rated-movies-title">Rated Movies List</h3>
            <table className="movies-table">
                <thead>
                    <tr>
                        <th>№</th>
                        <th>Title</th>
                        <th>Release Year</th>
                        <th>Rating</th>
                        <th>Last Changed</th>
                    </tr>
                </thead>
                <tbody>
                    {ratedMovies.map((element, index) => (
                        <tr
                            key={index}
                            onClick={() => navigate(`/movies/${element.movieId}`)}
                            className="movie-row"
                        >
                            <td>{index + 1}</td>
                            <td>{element.title}</td>
                            <td>{element.releaseYear}</td>
                            <td>{element.rating}</td>
                            <td>{validateDate(element.ratedAt)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default RatedMoviesList;