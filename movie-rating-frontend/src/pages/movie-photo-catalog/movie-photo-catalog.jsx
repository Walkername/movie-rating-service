import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { downloadFiles } from "../../api/file-api";
import ImageGallery from "../../components/image-gallery/image-gallery";
import ImageUploadForm from "../../components/image-upload-form/image-upload-form";
import NavigationBar from "../../components/navigation/navigation-bar/navigation-bar";
import { updateMoviePoster } from "../../api/admin-movie-api";
import ImageViewer from "../../components/image-viewer/image-viewer";
import { uploadFile } from "../../api/admin-file-api";
import getClaimFromToken from "../../utils/token-validation/token-validation";
import "./movie-photo-catalog.css";

export default function MoviePhotoCatalog() {
    const { id } = useParams();
    const token = localStorage.getItem("accessToken");
    const tokenRole = token ? getClaimFromToken(token, "role") : null;
    const isAccessToEdit = tokenRole === "ADMIN";

    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(24);
    const [sort, setSort] = useState("uploadedAt:desc");
    const [isLoading, setIsLoading] = useState(true);
    const [totalPhotos, setTotalPhotos] = useState(0);
    const [movieTitle, setMovieTitle] = useState("Movie");

    const [pageResponse, setPageResponse] = useState({
        content: [],
        limit: 0,
        page: 0,
        totalElements: 0,
        totalPages: 0
    });

    // ImageViewer states
    const [viewStatus, setViewStatus] = useState(false);
    const [selectedPhoto, setSelectedPhoto] = useState(null);

    // ImageUploadForm states
    const [previewStatus, setPreviewStatus] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchPhotos();
        
        // Здесь можно добавить запрос за названием фильма, если нужно
        // fetchMovieTitle(id).then(setMovieTitle);
    }, [id, page, limit, sort]);

    const fetchPhotos = () => {
        setIsLoading(true);
        downloadFiles("movie", id, page, limit, sort)
            .then((data) => {
                setPageResponse(data);
                setTotalPhotos(data.totalElements);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error("Error loading photos:", error);
                setIsLoading(false);
            });
    };

    const handlePhotoClick = (photo) => {
        setSelectedPhoto(photo);
        setViewStatus(true);
    };

    const setMoviePoster = (photo) => {
        updateMoviePoster(id, photo.fileId)
            .then(() => {
                // Можно показать уведомление об успехе
                console.log("Poster updated successfully");
                fetchPhotos(); // Обновляем список фотографий
            })
            .catch((error) => {
                console.error("Error updating poster:", error);
                // Можно показать уведомление об ошибке
            });
    };

    const movieActions = [
        {
            label: "Set as Movie Poster",
            handler: setMoviePoster,
            primary: true,
            icon: <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
        }
    ];

    const handleUploadPhoto = (evt) => {
        if (evt) evt.preventDefault();

        if (!selectedFile) {
            alert("Please select a file first");
            return;
        }

        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", selectedFile);

        uploadFile(formData, "movie", id)
            .then(() => {
                // Cleanup preview
                if (previewUrl) {
                    URL.revokeObjectURL(previewUrl);
                }
                setPreviewStatus(false);
                setSelectedFile(null);
                setPreviewUrl(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
                setIsUploading(false);

                // Refresh photo list
                fetchPhotos();
            })
            .catch((error) => {
                console.error("Upload error:", error);
                alert("Error uploading photo");
                setIsUploading(false);
            });
    };

    const handleSortChange = (e) => {
        setSort(e.target.value);
        setPage(0); // Reset to first page when sorting changes
    };

    const handleLoadMore = () => {
        setLimit(prevLimit => prevLimit + 24);
    };

    const formatNumber = (num) => {
        return new Intl.NumberFormat().format(num);
    };

    return (
        <div className="movie-photos">
            <NavigationBar />
            
            <div className="movie-photos__content">
                <div className="movie-photos__card">
                    <div className="movie-photos__header">
                        <h1 className="movie-photos__title">Photo Gallery</h1>
                        <p className="movie-photos__subtitle">
                            Browse through all photos related to this movie
                        </p>
                    </div>

                    <div className="movie-photos__controls">
                        <Link 
                            to={`/movie/${id}`} 
                            className="movie-photos__back-button"
                        >
                            <svg 
                                className="movie-photos__back-icon" 
                                viewBox="0 0 24 24"
                            >
                                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                            </svg>
                            Back to Movie
                        </Link>

                        <div className="movie-photos__stats">
                            <div className="movie-photos__stat">
                                <svg 
                                    className="movie-photos__stat-icon" 
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                                </svg>
                                <span className="movie-photos__stat-value">
                                    {formatNumber(totalPhotos)}
                                </span>
                                <span>photos</span>
                            </div>
                            
                            <div className="movie-photos__filters">
                                <select 
                                    className="movie-photos__select"
                                    value={sort}
                                    onChange={handleSortChange}
                                >
                                    <option value="uploadedAt:desc">Newest First</option>
                                    <option value="uploadedAt:asc">Oldest First</option>
                                    <option value="fileSize:desc">Largest First</option>
                                    <option value="fileSize:asc">Smallest First</option>
                                </select>
                            </div>
                        </div>

                        <ImageUploadForm
                            isAccessToEdit={isAccessToEdit}
                            handleUploadPhoto={handleUploadPhoto}
                            previewStatus={previewStatus}
                            setPreviewStatus={setPreviewStatus}
                            selectedFile={selectedFile}
                            setSelectedFile={setSelectedFile}
                            previewUrl={previewUrl}
                            setPreviewUrl={setPreviewUrl}
                            fileInputRef={fileInputRef}
                            isUploading={isUploading}
                        />
                    </div>

                    {isLoading ? (
                        <div className="movie-photos__loading">
                            <div className="movie-photos__spinner"></div>
                            <p>Loading photos...</p>
                        </div>
                    ) : pageResponse.content.length === 0 ? (
                        <div className="movie-photos__empty">
                            <svg 
                                className="movie-photos__empty-icon" 
                                viewBox="0 0 24 24"
                            >
                                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                            </svg>
                            <h3 className="movie-photos__empty-title">No Photos Yet</h3>
                            <p className="movie-photos__empty-text">
                                {isAccessToEdit 
                                    ? "Upload the first photo to get started!"
                                    : "No photos have been uploaded for this movie yet."
                                }
                            </p>
                        </div>
                    ) : (
                        <ImageGallery
                            pageResponse={pageResponse}
                            limit={limit}
                            setLimit={setLimit}
                            onPhotoClick={handlePhotoClick}
                            onLoadMore={handleLoadMore}
                        />
                    )}

                    <ImageViewer
                        isAccessToEdit={isAccessToEdit}
                        viewStatus={viewStatus}
                        setViewStatus={setViewStatus}
                        selectedPhoto={selectedPhoto}
                        setSelectedPhoto={setSelectedPhoto}
                        additionalActions={movieActions}
                        photos={pageResponse.content}
                        currentIndex={pageResponse.content.findIndex(photo => 
                            selectedPhoto && (photo.id === selectedPhoto.id || photo.url === selectedPhoto.url)
                        )}
                        onIndexChange={(newIndex) => {
                            setSelectedPhoto(pageResponse.content[newIndex]);
                        }}
                    />
                </div>
            </div>
        </div>
    );
}