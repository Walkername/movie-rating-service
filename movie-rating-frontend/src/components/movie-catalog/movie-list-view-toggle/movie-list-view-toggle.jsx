import "./movie-list-view-toggle.css";

function MovieViewToggle({ viewMode, setViewMode }) {
    const handleViewMode = (state) => {
        setViewMode(state);
        
        const searchParams = new URLSearchParams(window.location.search);
        searchParams.set('viewmode', state);

        const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
        window.history.pushState({}, '', newUrl);
    };

    return (
        <div className="view-toggle">
            <button
                className={`view-toggle__button ${!viewMode ? 'view-toggle__button--active' : ''}`}
                onClick={() => handleViewMode(false)}
                title="Grid view"
                aria-label="Switch to grid view"
            >
                <svg 
                    className="view-toggle__icon" 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 16 16"
                    fill="currentColor"
                >
                    <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5zM2.5 2a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5zm6.5.5A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5zM1 10.5A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5zm6.5.5A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5z" />
                </svg>
            </button>
            
            <button
                className={`view-toggle__button ${viewMode ? 'view-toggle__button--active' : ''}`}
                onClick={() => handleViewMode(true)}
                title="List view"
                aria-label="Switch to list view"
            >
                <svg 
                    className="view-toggle__icon" 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 16 16"
                    fill="currentColor"
                >
                    <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5" />
                </svg>
            </button>
        </div>
    );
}

export default MovieViewToggle;