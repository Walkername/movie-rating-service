import { useState, useEffect } from "react";
import "./image-gallery.css";

export default function ImageGallery({
    pageResponse = {
        content: [],
        totalPages: 0,
        page: 0,
        totalElements: 0,
        limit: 0
    },
    limit,
    setLimit,
    onPhotoClick,
    onLoadMore
}) {
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const morePhotos = 24;
    const hasNextPage = pageResponse.page < pageResponse.totalPages - 1;
    const remainingPhotos = pageResponse.totalElements - pageResponse.content.length;

    const loadMorePhotos = () => {
        if (hasNextPage && onLoadMore) {
            setIsLoadingMore(true);
            onLoadMore();
            // Сброс состояния загрузки после небольшой задержки
            setTimeout(() => setIsLoadingMore(false), 500);
        } else if (setLimit) {
            setLimit(limit + morePhotos);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        } catch {
            return '';
        }
    };

    const formatTitle = (title, index) => {
        if (title && title.trim()) return title;
        return `Photo ${index + 1}`;
    };

    // Сброс состояния загрузки при изменении данных
    useEffect(() => {
        setIsLoadingMore(false);
    }, [pageResponse.content]);

    if (!pageResponse.content || pageResponse.content.length === 0) {
        return null;
    }

    return (
        <div className="image-gallery">
            <div className="image-gallery__grid">
                {pageResponse.content.map((photo, index) => (
                    <div
                        className="image-gallery__card"
                        key={photo.id || index}
                        onClick={() => onPhotoClick(photo)}
                        role="button"
                        tabIndex={0}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                onPhotoClick(photo);
                            }
                        }}
                        aria-label={`View ${formatTitle(photo.title, index)}`}
                    >
                        <img
                            className="image-gallery__image"
                            src={photo.url}
                            alt={formatTitle(photo.title, index)}
                            loading="lazy"
                            onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/400x300/333/666?text=Photo+Error';
                            }}
                        />
                        
                        <button 
                            className="image-gallery__fullscreen"
                            onClick={(e) => {
                                e.stopPropagation();
                                onPhotoClick(photo);
                            }}
                            aria-label="View in fullscreen"
                        >
                            <svg 
                                className="image-gallery__fullscreen-icon" 
                                viewBox="0 0 24 24"
                            >
                                <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
                            </svg>
                        </button>
                        
                        <div className="image-gallery__overlay">
                            <div className="image-gallery__info">
                                <div className="image-gallery__title">
                                    {formatTitle(photo.title, index)}
                                </div>
                                {photo.uploadedAt && (
                                    <div className="image-gallery__date">
                                        {formatDate(photo.uploadedAt)}
                                    </div>
                                )}
                                {photo.fileSize && (
                                    <div className="image-gallery__size">
                                        {Math.round(photo.fileSize / 1024)} KB
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
                
                {hasNextPage && !isLoadingMore && (
                    <div 
                        className="image-gallery__card image-gallery__load-more"
                        onClick={loadMorePhotos}
                        role="button"
                        tabIndex={0}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                loadMorePhotos();
                            }
                        }}
                        aria-label="Load more photos"
                    >
                        <div className="image-gallery__load-more-content">
                            <svg 
                                className="image-gallery__load-more-icon" 
                                viewBox="0 0 24 24"
                            >
                                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                            </svg>
                            <span className="image-gallery__load-more-text">
                                Load More
                            </span>
                            {remainingPhotos > 0 && (
                                <span className="image-gallery__load-more-count">
                                    {remainingPhotos} more photos
                                </span>
                            )}
                        </div>
                    </div>
                )}
                
                {isLoadingMore && (
                    <div className="image-gallery__card image-gallery__loading">
                        <div className="image-gallery__loading-spinner"></div>
                        <span>Loading...</span>
                    </div>
                )}
            </div>
            
            {/* Пагинация (альтернатива Load More) */}
            {pageResponse.totalPages > 1 && (
                <div className="image-gallery__pagination">
                    <button
                        className="image-gallery__page-button"
                        onClick={() => {/* Обработчик предыдущей страницы */}}
                        disabled={pageResponse.page === 0}
                    >
                        Previous
                    </button>
                    
                    <span className="image-gallery__page-info">
                        Page {pageResponse.page + 1} of {pageResponse.totalPages}
                    </span>
                    
                    <button
                        className="image-gallery__page-button"
                        onClick={() => {/* Обработчик следующей страницы */}}
                        disabled={pageResponse.page === pageResponse.totalPages - 1}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}