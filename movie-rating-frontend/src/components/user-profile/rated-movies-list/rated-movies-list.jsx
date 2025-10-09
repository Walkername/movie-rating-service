import { useEffect, useState } from "react";
import { getMoviesByUser } from "../../../api/movie-api";
import validateDate from "../../../utils/date-validation/date-validation";
import { useNavigate } from "react-router-dom";
import "../../../styles/rated-movies-list.css";

function RatedMoviesList({ userId }) {
    const navigate = useNavigate();

    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(10);
    const [sort, setSort] = useState("ratedAt");
    const [sortField, setSortField] = useState("ratedAt");
    const [sortOrder, setSortOrder] = useState("desc");

    const [pageResponse, setPageResponse] = useState({
        content: [],
        limit: limit,
        page: page,
        totalElements: 0,
        totalPages: 0
    });

    const handleSortButton = (columnName) => {
        let order = sortOrder;
        if (sortField === columnName) {
            order = sortOrder === "desc" ? "asc" : "desc";
        }
        const newSort = `${columnName}:${order}`;
        setSortOrder(order);
        setSortField(columnName);
        setSort(newSort);

        // Обновляем URL параметр
        const searchParams = new URLSearchParams(window.location.search);
        searchParams.set('sort', newSort);

        const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
        window.history.pushState({}, '', newUrl);
    };

    const handleLimitButton = (e) => {
        const limitValue = e.target.value;
        const newPage = Math.floor((limit * page + 1) / limitValue);
        setPage(newPage);
        setLimit(e.target.value);

        // Обновляем URL параметр
        const searchParams = new URLSearchParams(window.location.search);
        searchParams.set('limit', limitValue);
        searchParams.set('page', newPage); // также обновляем страницу

        const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
        window.history.pushState({}, '', newUrl);
    };

    useEffect(() => {
        getMoviesByUser(userId, page, limit, sort)
            .then((data) => {
                setPageResponse(data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [userId, page, limit, sort]);

    const handlePageButton = (value) => {
        setPage(value);
    };

    return (
        <div className="rated-movies-container">
            <h3 className="rated-movies-title">Rated Movies List</h3>
            <select onChange={handleLimitButton}>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
            </select>
            <table className="movies-table">
                <thead>
                    <tr>
                        <th>№</th>
                        <th>Title</th>
                        <th>Release Year</th>
                        <th>Average Rating</th>
                        <th>
                            <div onClick={() => handleSortButton("rating")}>
                                <span>Rating</span>
                                {
                                    sortField === "rating" && (
                                        <span className={`sort-order-column sort-order-${sortOrder}`}>
                                            <span className="sort-order-column-icon"></span>
                                        </span>
                                    )
                                }
                            </div>
                        </th>
                        <th>
                            <div onClick={() => handleSortButton("ratedAt")}>
                                <span>Last Changed</span>
                                {
                                    sortField === "ratedAt" && (
                                        <span className={`sort-order-column sort-order-${sortOrder}`}>
                                            <span className="sort-order-column-icon"></span>
                                        </span>
                                    )
                                }
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {pageResponse.content.map((element, index) => (
                        <tr
                            key={index}
                            onClick={() => navigate(`/movie/${element.movieId}`)}
                            className="movie-row"
                        >
                            <td>{index + 1 + limit * page}</td>
                            <td>{element.title}</td>
                            <td>{element.releaseYear}</td>
                            <td>{element.averageRating}</td>
                            <td>{element.rating}</td>
                            <td>{validateDate(element.ratedAt)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div>
                {
                    Math.ceil(pageResponse.totalElements / limit) > 1 &&
                    Array.from({ length: Math.ceil(pageResponse.totalElements / limit) }, (_, index) => (
                        <button
                            className="page-button"
                            key={index}
                            onClick={() => handlePageButton(index)}
                        >
                            {index + 1}
                        </button>
                    ))
                }
            </div>
        </div>
    );
}

export default RatedMoviesList;