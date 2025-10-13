import { useEffect, useRef, useState } from "react"
import { searchMovieByTitle } from "../../../api/movie-api"
import { Link, useNavigate } from "react-router-dom";
import "./search-field.css";

export default function SearchField() {

    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [isPopupRendered, setIsPopupRendered] = useState(false);
    const [foundMovies, setFoundMovies] = useState([]);

    const inputRef = useRef(null);
    const popupRef = useRef(null);

    const navigate = useNavigate();

    useEffect(() => {
        if (isPopupVisible) {
            setIsPopupRendered(true);
        } else {
            // Ждем завершения анимации перед удалением из DOM
            const timer = setTimeout(() => {
                setIsPopupRendered(false);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [isPopupVisible]);

    const handleNavigate = (target) => {
        // Blur the input field before navigating
        if (inputRef.current) {
            inputRef.current.blur();
        }
        navigate(target);
    };

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
        searchMovieByTitle(query)
            .then((data) => {
                setFoundMovies(data);
            });
    }, 500);

    const handleClosePopup = () => {
        setIsPopupVisible(false);
    };

    const handleInputBlur = (e) => {
        // Check if the related target (the element receiving focus) is inside the popup
        if (!popupRef.current || !popupRef.current.contains(e.relatedTarget)) {
            setIsPopupVisible(false);
        }
    };

    const handlePopupMouseDown = (e) => {
        // Prevent the input from losing focus when clicking on the popup
        e.preventDefault();
    };

    return (
        <>
            <input
                className="search-field"
                type="text"
                ref={inputRef}
                onChange={handleSearch}
                onFocus={() => setIsPopupVisible(true)}
                onBlur={handleInputBlur}
            />
            {isPopupRendered && (
                <div
                    className={`search-popup ${isPopupVisible ? 'search-popup-visible' : 'search-popup-hidden'}`}
                    ref={popupRef}
                    onMouseDown={handlePopupMouseDown}>
                    <div className="search-popup-content">
                        {
                            foundMovies.length > 0 ? (
                                foundMovies.map((movie, index) => {
                                    let href = "/movies/" + movie.id;
                                    return (
                                        <Link className="search-popup-movie-card" key={index} to={href}>
                                            {movie.title} ({movie.releaseYear}):
                                            <span style={{ color: "#FF0000" }}> {movie.averageRating}</span>
                                        </Link>
                                    );
                                })
                            ) : (
                                <div>No movies found with that title.</div>
                            )
                        }
                    </div>
                </div>
            )}
        </>
    )

}