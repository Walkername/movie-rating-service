import { useCallback, useEffect, useState } from "react";
import "./image-viewer.css";

export default function ImageViewer({
    isAccessToEdit,
    viewStatus,
    setViewStatus,
    selectedPhoto,
    setSelectedPhoto,
    additionalActions = [],
    photos = [], // Массив всех фотографий для навигации
    currentIndex = 0, // Текущий индекс в массиве
    onIndexChange = null // Коллбэк при изменении индекса
}) {
    const [imageLoading, setImageLoading] = useState(true);
    const [imageError, setImageError] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    // Вычисляем текущий индекс, если передан массив фотографий
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(currentIndex);
    
    // Обновляем индекс при изменении selectedPhoto
    useEffect(() => {
        if (selectedPhoto && photos.length > 0) {
            const index = photos.findIndex(photo => 
                photo.id === selectedPhoto.id || photo.url === selectedPhoto.url
            );
            if (index !== -1) {
                setCurrentPhotoIndex(index);
            }
        }
    }, [selectedPhoto, photos]);

    const closeViewer = useCallback(() => {
        if (isClosing) return;
        
        setIsClosing(true);
        setTimeout(() => {
            setViewStatus(false);
            setSelectedPhoto(null);
            setImageLoading(true);
            setImageError(false);
            setIsClosing(false);
        }, 300);
    }, [setSelectedPhoto, setViewStatus, isClosing]);

    // Навигация
    const goToPrevious = () => {
        if (photos.length > 0) {
            const newIndex = (currentPhotoIndex - 1 + photos.length) % photos.length;
            setCurrentPhotoIndex(newIndex);
            setSelectedPhoto(photos[newIndex]);
            setImageLoading(true);
            setImageError(false);
            
            if (onIndexChange) {
                onIndexChange(newIndex);
            }
        }
    };

    const goToNext = () => {
        if (photos.length > 0) {
            const newIndex = (currentPhotoIndex + 1) % photos.length;
            setCurrentPhotoIndex(newIndex);
            setSelectedPhoto(photos[newIndex]);
            setImageLoading(true);
            setImageError(false);
            
            if (onIndexChange) {
                onIndexChange(newIndex);
            }
        }
    };

    useEffect(() => {
        const handleEsc = (event) => {
            if (event.key === 'Escape' && viewStatus) {
                closeViewer();
            }
            
            // Навигация стрелками
            if (viewStatus && photos.length > 0) {
                if (event.key === 'ArrowLeft') {
                    goToPrevious();
                } else if (event.key === 'ArrowRight') {
                    goToNext();
                }
            }
        };

        window.addEventListener('keydown', handleEsc);

        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, [viewStatus, closeViewer, currentPhotoIndex, photos]);

    const handleImageLoad = () => {
        setImageLoading(false);
    };

    const handleImageError = () => {
        setImageLoading(false);
        setImageError(true);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Unknown date';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch {
            return 'Unknown date';
        }
    };

    const formatFileSize = (bytes) => {
        if (!bytes) return 'Unknown size';
        if (bytes < 1024) return bytes + ' Bytes';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    if (!viewStatus || !selectedPhoto) return null;

    const modalClass = `image-viewer ${viewStatus ? 'image-viewer--active' : ''} ${isClosing ? 'image-viewer--closing' : ''}`;
    const hasNavigation = photos.length > 1;
    const canGoPrev = hasNavigation;
    const canGoNext = hasNavigation;

    return (
        <div 
            className={modalClass}
            onClick={closeViewer}
            role="dialog"
            aria-modal="true"
            aria-label="Image viewer"
        >
            <div
                className="image-viewer__content"
                onClick={(e) => e.stopPropagation()}
            >
                <button 
                    className="image-viewer__close"
                    onClick={closeViewer}
                    aria-label="Close image viewer"
                >
                    ×
                </button>

                {hasNavigation && (
                    <>
                        <button
                            className="image-viewer__navigation image-viewer__navigation--prev"
                            onClick={goToPrevious}
                            disabled={!canGoPrev}
                            aria-label="Previous image"
                        >
                            <svg 
                                className="image-viewer__nav-icon" 
                                viewBox="0 0 24 24"
                            >
                                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                            </svg>
                        </button>
                        <button
                            className="image-viewer__navigation image-viewer__navigation--next"
                            onClick={goToNext}
                            disabled={!canGoNext}
                            aria-label="Next image"
                        >
                            <svg 
                                className="image-viewer__nav-icon" 
                                viewBox="0 0 24 24"
                            >
                                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                            </svg>
                        </button>
                    </>
                )}

                <div className="image-viewer__image-container">
                    {imageLoading && (
                        <div className="image-viewer__loading">
                            <div className="image-viewer__spinner"></div>
                            <div className="image-viewer__loading-text">
                                Loading image...
                            </div>
                        </div>
                    )}
                    
                    {imageError ? (
                        <div className="image-viewer__error">
                            <svg 
                                className="image-viewer__error-icon" 
                                viewBox="0 0 24 24"
                            >
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                            </svg>
                            <div className="image-viewer__error-message">
                                Failed to load image
                            </div>
                        </div>
                    ) : (
                        <img
                            src={selectedPhoto.url}
                            alt={selectedPhoto.title || "Full screen view"}
                            className="image-viewer__image"
                            onLoad={handleImageLoad}
                            onError={handleImageError}
                            style={{ display: imageLoading ? 'none' : 'block' }}
                        />
                    )}
                </div>

                <div className="image-viewer__info">
                    {(selectedPhoto.title || selectedPhoto.uploadedAt) && (
                        <>
                            {selectedPhoto.title && (
                                <h3 className="image-viewer__title">
                                    {selectedPhoto.title}
                                </h3>
                            )}
                            
                            <div className="image-viewer__meta">
                                {selectedPhoto.uploadedAt && (
                                    <div className="image-viewer__meta-item">
                                        <svg 
                                            className="image-viewer__meta-icon" 
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                                        </svg>
                                        <span>{formatDate(selectedPhoto.uploadedAt)}</span>
                                    </div>
                                )}
                                
                                {selectedPhoto.fileSize && (
                                    <div className="image-viewer__meta-item">
                                        <svg 
                                            className="image-viewer__meta-icon" 
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
                                        </svg>
                                        <span>{formatFileSize(selectedPhoto.fileSize)}</span>
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {isAccessToEdit && additionalActions.length > 0 && (
                        <div className="image-viewer__actions">
                            {additionalActions.map((action, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        action.handler(selectedPhoto);
                                        // Закрываем вьювер после действия, если нужно
                                        if (action.closeAfterAction !== false) {
                                            closeViewer();
                                        }
                                    }}
                                    className={`image-viewer__action-button ${
                                        action.primary ? 'image-viewer__action-button--primary' : 
                                        action.secondary ? 'image-viewer__action-button--secondary' : ''
                                    }`}
                                    aria-label={action.label}
                                >
                                    {action.icon && (
                                        <svg 
                                            className="image-viewer__action-icon" 
                                            viewBox="0 0 24 24"
                                        >
                                            {action.icon}
                                        </svg>
                                    )}
                                    {action.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {hasNavigation && (
                    <div className="image-viewer__progress">
                        {photos.map((_, index) => (
                            <div
                                key={index}
                                className={`image-viewer__progress-dot ${
                                    index === currentPhotoIndex ? 'image-viewer__progress-dot--active' : ''
                                }`}
                                aria-label={`Image ${index + 1} of ${photos.length}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}