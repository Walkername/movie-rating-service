import { useCallback, useEffect, useRef, useState } from "react";
import { downloadFiles } from "../../api/file-api";
import "./photo-preview-strip.css";
import { Link } from "react-router-dom";
import ImageViewer from "../image-viewer/image-viewer";

export default function PhotoPreviewStrip({
    isAccessToEdit,
    context,
    contextId,
    addionalActions = [],
    maxPhotos = 10
}) {
    // ImageViewer
    const [viewStatus, setViewStatus] = useState(false);
    const [selectedPhoto, setSelectedPhoto] = useState(null);

    const handlePhotoClick = (photo) => {
        setSelectedPhoto(photo);
        setViewStatus(true);
    };

    const page = 0;
    const sort = "uploadedAt:desc";
    const [pageResponse, setPageResponse] = useState({
        content: [],
        limit: 0,
        page: 0,
        totalElements: 0,
        totalPages: 0
    });

    useEffect(() => {
        downloadFiles(context, contextId, page, maxPhotos, sort)
            .then((data) => {
                setPageResponse(data);
            });
    }, [contextId, page, maxPhotos, sort]);

    // Scrolling
    // Refs для контейнера прокрутки
    const scrollContainerRef = useRef(null);

    // Функции прокрутки
    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const scrollAmount = container.clientWidth * 0.8; // Прокручиваем 80% ширины контейнера
            container.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const scrollAmount = container.clientWidth * 0.8;
            container.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    // Проверяем, можно ли прокручивать влево/вправо
    const [showLeftButton, setShowLeftButton] = useState(false);
    const [showRightButton, setShowRightButton] = useState(false);

    const checkScrollButtons = () => {
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            setShowLeftButton(container.scrollLeft > 0);
            setShowRightButton(
                container.scrollLeft < container.scrollWidth - container.clientWidth - 1
            );
        }
    };

    // Проверяем видимость кнопок при загрузке и изменении размера
    useEffect(() => {
        checkScrollButtons();

        const container = scrollContainerRef.current;
        if (container) {
            container.addEventListener('scroll', checkScrollButtons);
            window.addEventListener('resize', checkScrollButtons);
        }

        return () => {
            if (container) {
                container.removeEventListener('scroll', checkScrollButtons);
            }
            window.removeEventListener('resize', checkScrollButtons);
        };
    }, [pageResponse.content, checkScrollButtons]);

    return (
        <div className="photo-preview-strip">
            <div className="photo-strip-header">
                <h3 className="photo-strip-title">Recent Photos</h3>
                <Link
                    to={`/${context}/${contextId}/photos`}
                    className="view-all-button"
                >
                    <span>View All</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                    </svg>
                </Link>
            </div>

            <div className="photo-strip-wrapper">
                {/* Кнопка прокрутки влево */}
                {showLeftButton && (
                    <button
                        className="scroll-button scroll-button-left"
                        onClick={scrollLeft}
                        aria-label="Scroll left"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                        </svg>
                    </button>
                )}

                {/* Контейнер с фотографиями */}
                <div
                    className="photo-strip-container"
                    ref={scrollContainerRef}
                >
                    <div className="photo-strip-scroll">
                        {pageResponse.content.map((photo, index) => (
                            <div key={index} className="photo-strip-item" onClick={() => handlePhotoClick(photo)}>
                                <img
                                    src={photo.url}
                                    alt={photo.title}
                                    className="photo-strip-image"
                                    loading="lazy"
                                />
                            </div>
                        ))}
                        <Link
                            to={`/${context}/${contextId}/photos`}
                            className="photo-strip-item photo-strip-more-card"
                        >
                            <div className="more-card-content">
                                <svg
                                    width="32"
                                    height="32"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="more-card-icon"
                                >
                                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                                </svg>
                                <span className="more-card-text">More</span>
                                <span className="more-card-count">
                                    {pageResponse.totalElements > maxPhotos
                                        ? `+${pageResponse.totalElements - maxPhotos}`
                                        : 'All'
                                    }
                                </span>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Кнопка прокрутки вправо */}
                {showRightButton && (
                    <button
                        className="scroll-button scroll-button-right"
                        onClick={scrollRight}
                        aria-label="Scroll right"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                        </svg>
                    </button>
                )}

                <ImageViewer
                    isAccessToEdit={isAccessToEdit}
                    viewStatus={viewStatus}
                    setViewStatus={setViewStatus}
                    selectedPhoto={selectedPhoto}
                    setSelectedPhoto={setSelectedPhoto}
                    additionalActions={addionalActions}
                />
            </div>
        </div>
    );
}