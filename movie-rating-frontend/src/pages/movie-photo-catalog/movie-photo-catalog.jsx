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

export default function MoviePhotoCatalog() {
    const { id } = useParams();
    const token = localStorage.getItem("accessToken");
    const tokenRole = getClaimFromToken(token, "role");
    const isAccessToEdit = tokenRole == "ADMIN";

    const [photos, setPhotos] = useState([]);
    useEffect(() => {
        downloadFiles("movie", id)
            .then((data) => {
                setPhotos(data);
            });
    }, [id]);

    // ImageViewer
    const [viewStatus, setViewStatus] = useState(false);
    const [selectedPhoto, setSelectedPhoto] = useState(null);

    const handlePhotoClick = (photo) => {
        setSelectedPhoto(photo);
        setViewStatus(true);
    };

    const setMoviePoster = (photo) => {
        updateMoviePoster(id, photo.fileId);
    };

    const movieActions = [
        {
            label: "Set as Movie Poster",
            handler: setMoviePoster
        }
    ];

    // ImageUploadForm
    const [previewStatus, setPreviewStatus] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const fileInputRef = useRef(null);

    const handleUploadPhoto = (evt) => {
        if (evt) evt.preventDefault();

        if (!selectedFile) return;

        const formData = new FormData();
        formData.append("file", selectedFile);

        uploadFile(formData, "movie", id)
            .then(() => {
                if (previewUrl) {
                    URL.revokeObjectURL(previewUrl);
                }
                setPreviewStatus(false);
                setSelectedFile(null);
                setPreviewUrl(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }

                downloadFiles("movie", id)
                    .then((data) => {
                        setPhotos(data);
                    });
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <>
            <NavigationBar />

            <div>
                <h1>Photo Catalog</h1>
            </div>

            <div className="page-content-container">
                <div className="page-content">
                    <div>
                        <div className="header-actions">
                            <Link to={`/movie/${id}`} className="back-button">
                                ← Back to Movie
                            </Link>

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
                            />
                        </div>

                        <ImageGallery
                            photos={photos}
                            onPhotoClick={handlePhotoClick}
                        />
                        <ImageViewer
                            viewStatus={viewStatus}
                            setViewStatus={setViewStatus}
                            selectedPhoto={selectedPhoto}
                            setSelectedPhoto={setSelectedPhoto}
                            additionalActions={movieActions}
                        />
                    </div>
                </div>
            </div >
        </>
    );
}