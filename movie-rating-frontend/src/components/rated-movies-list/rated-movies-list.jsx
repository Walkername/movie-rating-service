import { useEffect, useState } from "react";
import { getMoviesByUser } from "../../api/movie-api";
import validateDate from "../../utils/date-validation/date-validation";
import { useNavigate } from "react-router-dom";

function RatedMoviesList({ userId }) {
    const navigate = useNavigate();

    const [ratedMovies, setRatedMovies] = useState([]);

    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(10);
    const [sort, setSort] = useState(true);

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
        <>
            <h3>Rated Movies List</h3>
            <table>
                <tr>
                    <th>Title</th>
                    <th>Release Year</th>
                    <th>Rating</th>
                    <th>Last changed</th>
                </tr>
                    {
                        ratedMovies.map((element, index) => {
                            return (
                                <tr key={index} onClick={() => navigate(`/movies/${element.movieId}`)}>
                                    <td>{element.title}</td>
                                    <td>{element.releaseYear}</td>
                                    <td>{element.rating}</td>
                                    <td>{validateDate(element.date)}</td>
                                </tr>
                                
                            )
                        })
                    }
            </table>
        </>
    )
}

export default RatedMoviesList;