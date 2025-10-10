
export default function ImageGallery({
    pageResponse = {
        content: []
    },
    limit,
    setLimit,
    onPhotoClick
}) {
    const morePhotos = 10;
    const hasNextPage = pageResponse.page < pageResponse.totalPages - 1;

    const loadMorePhotos = () => {
        if (hasNextPage) {
            setLimit(limit + morePhotos);
        }
    };

    return (
        <>
            <div className="user-photo-catalog">
                {
                    pageResponse.content.map((photo, index) => {
                        return (
                            <div
                                className="photo-card"
                                key={index}
                                onClick={() => onPhotoClick(photo)}
                            >
                                <img
                                    className="user-photo"
                                    key={index}
                                    src={photo.url}
                                    alt={`Photo ${index + 1}`}
                                />
                            </div>
                        )
                    })
                }
                {hasNextPage && (
                    <div 
                        className="photo-card load-more-card"
                        onClick={loadMorePhotos}
                    >
                        <div className="load-more-content">
                            <svg 
                                width="48" 
                                height="48" 
                                viewBox="0 0 24 24" 
                                fill="currentColor"
                                className="load-more-icon"
                            >
                                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                            </svg>
                            <span className="load-more-text">Load More</span>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}