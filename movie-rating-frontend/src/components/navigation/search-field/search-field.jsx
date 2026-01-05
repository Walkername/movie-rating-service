import { useEffect, useRef, useState } from "react";
import { searchMovieByTitle } from "../../../api/movie-api";
import { Link } from "react-router-dom";
import "./search-field.css";

export default function SearchField() {
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [isPopupRendered, setIsPopupRendered] = useState(false);
    const [foundMovies, setFoundMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const inputRef = useRef(null);
    const popupRef = useRef(null);

    useEffect(() => {
        if (isPopupVisible) {
            setIsPopupRendered(true);
        } else {
            const timer = setTimeout(() => {
                setIsPopupRendered(false);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [isPopupVisible]);

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
        const query = e.target.value.trim();
        if (query.length < 2) {
            setFoundMovies([]);
            return;
        }

        setIsLoading(true);
        searchMovieByTitle(query)
            .then((data) => {
                setFoundMovies(data);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, 500);

    const handleInputBlur = (e) => {
        if (!popupRef.current || !popupRef.current.contains(e.relatedTarget)) {
            setIsPopupVisible(false);
        }
    };

    const handlePopupMouseDown = (e) => {
        e.preventDefault();
    };

    const handleMovieSelect = () => {
        setIsPopupVisible(false);
        if (inputRef.current) {
            inputRef.current.value = "";
            inputRef.current.blur();
        }
    };

    return (
        <div className="search">
            <input
                className="search__input"
                type="text"
                ref={inputRef}
                onChange={handleSearch}
                onFocus={() => setIsPopupVisible(true)}
                onBlur={handleInputBlur}
                placeholder="Search for movies..."
                aria-label="Search movies"
            />

            {isPopupRendered && (
                <div
                    className={`search__popup ${isPopupVisible ? "search__popup--visible" : "search__popup--hidden"}`}
                    ref={popupRef}
                    onMouseDown={handlePopupMouseDown}
                    aria-live="polite"
                >
                    <div className="search__popup-content">
                        {isLoading ? (
                            <div className="search__loader">
                                <span>Searching...</span>
                            </div>
                        ) : foundMovies.length > 0 ? (
                            foundMovies.map((movie) => (
                                <Link
                                    className="search__movie-card"
                                    key={movie.id}
                                    to={`/movie/${movie.id}`}
                                    onClick={handleMovieSelect}
                                >
                                    <div className="search__movie-title">
                                        {movie.title}
                                    </div>
                                    <div className="search__movie-meta">
                                        <span className="search__movie-year">
                                            {movie.releaseYear}
                                        </span>
                                        {movie.averageRating && (
                                            <span className="search__movie-rating">
                                                {movie.averageRating.toFixed(1)}
                                            </span>
                                        )}
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="search__no-results">
                                {inputRef.current?.value.trim().length >= 2
                                    ? "No movies found with that title."
                                    : "Type at least 2 characters to search"}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
