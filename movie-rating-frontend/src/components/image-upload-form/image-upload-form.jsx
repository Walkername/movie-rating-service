import { useRef, useState } from "react";
import getClaimFromToken from "../../utils/token-validation/token-validation";
import { uploadMyFile } from "../../api/file-api";
import ImageUploadViewer from "../image-upload-viewer/image-upload-viewer";

export default function ImageUploadForm({id}) {
    const token = localStorage.getItem("accessToken");
    const tokenId = getClaimFromToken(token, "id");

    const [previewStatus, setPreviewStatus] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setSelectedFile(file);

            const fileUrl = URL.createObjectURL(file);
            setPreviewUrl(fileUrl);
            setPreviewStatus(true);
        }
    };

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
                window.location.reload();
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <>
            {
                id == tokenId &&
                (
                    <form onSubmit={handleUploadPhoto} className="upload-form">
                        <div className="file-input-container">
                            <input
                                ref={fileInputRef}
                                id="profile-pic"
                                type="file"
                                onChange={handleFileChange}
                                className="file-input"
                                accept="image/*"
                            />
                            <label htmlFor="profile-pic" className="file-input-label">
                                Choose Photo
                            </label>
                            {selectedFile && (
                                <span className="file-name">{selectedFile.name}</span>
                            )}
                        </div>
                    </form>
                )
            }
            <ImageUploadViewer
                previewStatus={previewStatus}
                setPreviewStatus={setPreviewStatus}
                handleUploadPhoto={handleUploadPhoto}
                setSelectedFile={setSelectedFile}
                fileInputRef={fileInputRef}
                previewUrl={previewUrl}
                setPreviewUrl={setPreviewUrl}
            />
        </>
    );
}