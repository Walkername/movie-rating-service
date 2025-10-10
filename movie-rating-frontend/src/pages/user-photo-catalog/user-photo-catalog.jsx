import { useEffect, useRef, useState } from "react";
import NavigationBar from "../../components/navigation/navigation-bar/navigation-bar";
import { downloadFiles, uploadMyFile } from "../../api/file-api";
import { Link, useParams } from "react-router-dom";
import "../../styles/user-photo-catalog.css";
import ImageGallery from "../../components/image-gallery/image-gallery";
import ImageUploadForm from "../../components/image-upload-form/image-upload-form";
import ImageViewer from "../../components/image-viewer/image-viewer";
import { updateMyProfilePictureId } from "../../api/user-api";
import getClaimFromToken from "../../utils/token-validation/token-validation";

export default function UserPhotoCatalog() {
    const { id } = useParams();
    const token = localStorage.getItem("accessToken");
    const tokenId = getClaimFromToken(token, "id");
    const isAccessToEdit = id == tokenId;

    const [pageResponse, setPageResponse] = useState({
        content: [],
        limit: 0,
        page: 0,
        totalElements: 0,
        totalPages: 0
    });
    useEffect(() => {
        downloadFiles("user", id)
            .then((data) => {
                setPageResponse(data);
            });
    }, [id]);

    // ImageViewer
    const [viewStatus, setViewStatus] = useState(false);
    const [selectedPhoto, setSelectedPhoto] = useState(null);

    const handlePhotoClick = (photo) => {
        setSelectedPhoto(photo);
        setViewStatus(true);
    };

    const setProfilePicture = (photo) => {
        updateMyProfilePictureId(photo.fileId);
    };

    const userActions = [
        {
            label: "Set as Profile Picture",
            handler: setProfilePicture
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

        uploadMyFile(formData, "user")
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

                downloadFiles("user", id)
                    .then((data) => {
                        setPageResponse(data);
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
                            <Link to={`/user/${id}`} className="back-button">
                                ← Back to Profile
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
                            pageResponse={pageResponse}
                            onPhotoClick={handlePhotoClick}
                        />
                        <ImageViewer
                            isAccessToEdit={isAccessToEdit}
                            viewStatus={viewStatus}
                            setViewStatus={setViewStatus}
                            selectedPhoto={selectedPhoto}
                            setSelectedPhoto={setSelectedPhoto}
                            additionalActions={userActions}
                        />
                    </div>
                </div>
            </div >
        </>
    )
}
