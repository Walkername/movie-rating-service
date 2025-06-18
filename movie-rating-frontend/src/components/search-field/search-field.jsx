import { useRef, useState } from "react"
import { searchMovieByTitle } from "../../api/movie-api"
import { useNavigate } from "react-router-dom";

export default function SearchField() {

    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [foundMovies, setFoundMovies] = useState([]);

    const inputRef = useRef(null);
    const popupRef = useRef(null);

    const navigate = useNavigate();

    const handleNavigate = (target) => {
        // Blur the input field before navigating
        if (inputRef.current) {
            inputRef.current.blur();
        }
        navigate(target);
    }

    const handleSearch = (e) => {
        const query = e.target.value;
        searchMovieByTitle(query)
            .then((data) => {
                setFoundMovies(data);
            })
    }

    const handleClosePopup = () => {
        setIsPopupVisible(false);
    }

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
            {isPopupVisible && (
                <div className="popup" ref={popupRef} onMouseDown={handlePopupMouseDown}>
                    <div className="popup-content">
                        {
                            foundMovies.length > 0 ? (
                                foundMovies.map((movie, index) => {
                                    let href = "/movies/" + movie.id;
                                    return (
                                        <div className="movie-div" key={index} onClick={() => handleNavigate(href)}>
                                            {movie.title} ({movie.releaseYear}):
                                            <span style={{ color: "#FF0000" }}> {movie.averageRating}</span>
                                        </div>
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