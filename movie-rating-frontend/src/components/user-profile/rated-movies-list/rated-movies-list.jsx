import { useEffect, useState } from "react";
import validateDate from "../../../utils/date-validation/date-validation";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import "./rated-movies-list.css";
import { getMoviesByUser, searchUserMoviesByTitle } from "../../../api/user-library-api";

function RatedMoviesList({ userId }) {
    const navigate = useNavigate();

    const [searchParams, setSearchParams] = useSearchParams();

    const pagePar = searchParams.get("page") ? searchParams.get("page") : 0;
    const limitPar = searchParams.get("limit") ? searchParams.get("limit") : 10;
    const sortPar = searchParams.get("sort") ? searchParams.get("sort") : "ratedAt";

    const [page, setPage] = useState(pagePar);
    const [limit, setLimit] = useState(limitPar);
    const [sort, setSort] = useState(`${sortPar}:desc`);
    const sortParams = sortPar.split(":");
    const [sortField, setSortField] = useState(sortParams[0] ? sortParams[0] : "ratedAt");
    const [sortOrder, setSortOrder] = useState(sortParams[1] ? sortParams[1] : "desc");

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

        // Update URL parameters
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

        // Update URL parameters
        const searchParams = new URLSearchParams(window.location.search);
        searchParams.set('limit', limitValue);
        searchParams.set('page', newPage);

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

        // Update URL parameters
        const searchParams = new URLSearchParams(window.location.search);
        searchParams.set('page', value);

        const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
        window.history.pushState({}, '', newUrl);
    };

    // Search movies by Title
    const [searchValue, setSearchValue] = useState("");
    const [foundMovies, setFoundMovies] = useState({
        content: [],
        page: 0,
        limit: 10,
        totalElements: 0,
        totalPages: 0
    });
    const [showDropdown, setShowDropdown] = useState(false);
    const [isFadingOut, setIsFadingOut] = useState(false);

    const debounce = (func, delay) => {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func(...args);
            }, delay);
        };
    };

    const handleSearch = debounce((e) => {
        const query = e.target.value;
        if (query.trim() === "") {
            setShowDropdown(false);
            return;
        }
        searchUserMoviesByTitle(userId, query)
            .then((data) => {
                setFoundMovies(data);
                setShowDropdown(true);
                setIsFadingOut(false);
            })
            .catch(() => setShowDropdown(false));
    }, 500);

    const handleMovieSelect = () => {
        setShowDropdown(false);
        setSearchValue("");
    };

    const handleFocus = () => {
        if (foundMovies.content.length > 0) {
            setShowDropdown(true);
            setIsFadingOut(false);
        }
    };

    const handleBlur = () => {
        // добавляем эффект исчезновения
        setIsFadingOut(true);
        setTimeout(() => {
            setShowDropdown(false);
            setIsFadingOut(false);
        }, 150); // длительность совпадает с fadeOut
    };

    return (
        <div className="rated-movies-container">
            <h3 className="rated-movies-title">Rated Movies List</h3>
            <div className="search-container">
                <input
                    type="text"
                    onChange={handleSearch}
                    placeholder="Search"
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                />
                {showDropdown && foundMovies.content.length > 0 && (
                    <div className={`search-results-dropdown ${isFadingOut ? "fade-out" : "fade-in"}`}>
                        {foundMovies.content.length > 0 ? (
                            foundMovies.content.map((movie, index) => (
                                <Link
                                    key={index}
                                    className="search-result-item"
                                    to={`/movie/${movie.movieId}`}
                                    onClick={() => handleMovieSelect(movie.movieId)}
                                >
                                    <span className="search-result-title">{movie.movieTitle}</span>
                                    <span className="search-result-year">({movie.movieReleaseYear})</span>
                                </Link>
                            ))
                        ) : (
                            <div className="search-result-item disabled">No results</div>
                        )}
                    </div>
                )}
            </div>
            <div></div>
            <select onChange={handleLimitButton} value={limit}>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
            </select>
            <table className="movies-table">
                <thead>
                    <tr>
                        <th>№</th>
                        <th>Title</th>
                        <TableTitleColumn
                            title="Release Year"
                            sortOrder={sortOrder}
                            sortField={sortField}
                            sortFieldToCheck="movieReleaseYear"
                            onColumnClick={() => handleSortButton("movieReleaseYear")}
                        />
                        <TableTitleColumn
                            title="Average Rating"
                            sortOrder={sortOrder}
                            sortField={sortField}
                            sortFieldToCheck="movieAverageRating"
                            onColumnClick={() => handleSortButton("movieAverageRating")}
                        />
                        <TableTitleColumn
                            title="Rating"
                            sortOrder={sortOrder}
                            sortField={sortField}
                            sortFieldToCheck="rating"
                            onColumnClick={() => handleSortButton("rating")}
                        />
                        <TableTitleColumn
                            title="Last Changed"
                            sortOrder={sortOrder}
                            sortField={sortField}
                            sortFieldToCheck="ratedAt"
                            onColumnClick={() => handleSortButton("ratedAt")}
                        />
                    </tr>
                </thead>
                <tbody>
                    {pageResponse.content.map((element, index) => (
                        <tr
                            key={index}
                            onClick={() => navigate(`/movie/${element.movieId}`)}
                        >
                            <td>{index + 1 + limit * page}</td>
                            <td>{element.movieTitle}</td>
                            <td>{element.movieReleaseYear}</td>
                            <td>{element.movieAverageRating}</td>
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

function TableTitleColumn({
    title,
    sortOrder,
    sortField,
    sortFieldToCheck,
    onColumnClick
}) {
    return (
        <th onClick={onColumnClick}>
            <div>
                <span>{title}</span>
                <span
                    className={`sort-order-column sort-order-${sortOrder}`}
                    style={{ visibility: sortField === sortFieldToCheck ? "visible" : "hidden" }}
                >
                    <span className="sort-order-column-icon"></span>
                </span>
            </div>
        </th>
    );
}

export default RatedMoviesList;