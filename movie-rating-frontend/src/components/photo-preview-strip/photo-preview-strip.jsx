import { useCallback, useEffect, useRef, useState } from "react";
import { downloadFiles } from "../../api/file-api";
import "./photo-preview-strip.css";
import { Link } from "react-router-dom";
import ImageViewer from "../image-viewer/image-viewer";

export default function PhotoPreviewStrip({
    isAccessToEdit,
    context,
    contextId,
    additionalActions = [],
    maxPhotos = 10,
}) {
    const [isLoading, setIsLoading] = useState(true);
    const [viewStatus, setViewStatus] = useState(false);
    const [selectedPhoto, setSelectedPhoto] = useState(null);

    const page = 0;
    const sort = "uploadedAt:desc";
    const [pageResponse, setPageResponse] = useState({
        content: [],
        limit: 0,
        page: 0,
        totalElements: 0,
        totalPages: 0,
    });

    const handlePhotoClick = (photo) => {
        setSelectedPhoto(photo);
        // console.log(photo);
        // console.log(pageResponse.content.findIndex(phot1o =>
        //     photo && (phot1o.fileId === photo.fileId)
        // ));
        setViewStatus(true);
    };

    useEffect(() => {
        setIsLoading(true);
        downloadFiles(context, contextId, page, maxPhotos, sort)
            .then((data) => {
                setPageResponse(data);
            })
            .catch((error) => {
                console.error("Error loading photos:", error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [contextId, page, maxPhotos, sort, context]);

    // Scrolling functionality
    const scrollContainerRef = useRef(null);
    const [showLeftButton, setShowLeftButton] = useState(false);
    const [showRightButton, setShowRightButton] = useState(false);

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({
                left: -300,
                behavior: "smooth",
            });
        }
    };

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({
                left: 300,
                behavior: "smooth",
            });
        }
    };

    const checkScrollButtons = useCallback(() => {
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            setShowLeftButton(container.scrollLeft > 10);
            setShowRightButton(
                container.scrollLeft <
                    container.scrollWidth - container.clientWidth - 10,
            );
        }
    }, []);

    useEffect(() => {
        checkScrollButtons();

        const container = scrollContainerRef.current;
        const handleScroll = () => checkScrollButtons();

        if (container) {
            container.addEventListener("scroll", handleScroll);
            window.addEventListener("resize", checkScrollButtons);
        }

        return () => {
            if (container) {
                container.removeEventListener("scroll", handleScroll);
            }
            window.removeEventListener("resize", checkScrollButtons);
        };
    }, [pageResponse.content, checkScrollButtons]);

    if (isLoading) {
        return (
            <div className="photo-strip">
                <div className="photo-strip__loading">
                    <div className="photo-strip__spinner"></div>
                    <span>Loading photos...</span>
                </div>
            </div>
        );
    }

    if (pageResponse.content.length === 0) {
        return (
            <div className="photo-strip">
                <div className="photo-strip__header">
                    <h3 className="photo-strip__title">Photos</h3>
                    <Link
                        to={`/${context}/${contextId}/photos`}
                        className="photo-strip__view-all"
                    >
                        <span>View All ({pageResponse.totalElements})</span>
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                        </svg>
                    </Link>
                </div>
                <div className="photo-strip__empty">
                    <svg
                        className="photo-strip__empty-icon"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                    >
                        <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                    </svg>
                    <p>No photos yet</p>
                </div>
            </div>
        );
    }

    const remainingPhotos = pageResponse.totalElements - maxPhotos;

    return (
        <div className="photo-strip">
            <div className="photo-strip__header">
                <h3 className="photo-strip__title">Recent Photos</h3>
                {pageResponse.totalElements > 0 && (
                    <Link
                        to={`/${context}/${contextId}/photos`}
                        className="photo-strip__view-all"
                    >
                        <span>View All ({pageResponse.totalElements})</span>
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                        </svg>
                    </Link>
                )}
            </div>

            <div className="photo-strip__wrapper">
                {showLeftButton && (
                    <button
                        className="photo-strip__scroll-button photo-strip__scroll-button--left"
                        onClick={scrollLeft}
                        aria-label="Scroll left"
                    >
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                        </svg>
                    </button>
                )}

                <div
                    className="photo-strip__container"
                    ref={scrollContainerRef}
                >
                    <div className="photo-strip__scroll">
                        {pageResponse.content.map((photo, index) => (
                            <div
                                key={photo.id || index}
                                className="photo-strip__item"
                                onClick={() => handlePhotoClick(photo)}
                                role="button"
                                tabIndex={0}
                            >
                                <img
                                    src={photo.url}
                                    alt={photo.title || `Photo ${index + 1}`}
                                    className="photo-strip__image"
                                    loading="lazy"
                                    onError={(e) => {
                                        e.target.src =
                                            "https://via.placeholder.com/200x150/333/666?text=Photo+Error";
                                    }}
                                />
                                <span className="photo-strip__count">
                                    {index + 1}/{pageResponse.totalElements}
                                </span>
                            </div>
                        ))}

                        {pageResponse.totalElements > maxPhotos && (
                            <Link
                                to={`/${context}/${contextId}/photos`}
                                className="photo-strip__item photo-strip__more-card"
                            >
                                <div className="photo-strip__more-content">
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        className="photo-strip__more-icon"
                                    >
                                        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                                    </svg>
                                    <span className="photo-strip__more-text">
                                        View All
                                    </span>
                                    {remainingPhotos > 0 && (
                                        <span className="photo-strip__more-count">
                                            +{remainingPhotos}
                                        </span>
                                    )}
                                </div>
                            </Link>
                        )}
                    </div>
                </div>

                {showRightButton && (
                    <button
                        className="photo-strip__scroll-button photo-strip__scroll-button--right"
                        onClick={scrollRight}
                        aria-label="Scroll right"
                    >
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                        </svg>
                    </button>
                )}
            </div>

            {viewStatus && selectedPhoto && (
                <ImageViewer
                    isAccessToEdit={isAccessToEdit}
                    viewStatus={viewStatus}
                    setViewStatus={setViewStatus}
                    selectedPhoto={selectedPhoto}
                    setSelectedPhoto={setSelectedPhoto}
                    additionalActions={additionalActions}
                    photos={pageResponse.content} // Передаем все фотографии для навигации
                    currentIndex={pageResponse.content.findIndex(
                        (photo) =>
                            selectedPhoto &&
                            photo.fileId === selectedPhoto.fileId,
                    )}
                    onIndexChange={(newIndex) => {
                        // Можно обновить состояние, если нужно
                        // setSelectedPhoto()
                    }}
                />
            )}
        </div>
    );
}
