import { useState } from "react";
import ImageUploadViewer from "../image-upload-viewer/image-upload-viewer";
import "./image-upload-form.css";

export default function ImageUploadForm({
    isAccessToEdit,
    handleUploadPhoto,
    previewStatus,
    setPreviewStatus,
    selectedFile,
    setSelectedFile,
    previewUrl,
    setPreviewUrl,
    fileInputRef,
    isUploading = false,
}) {
    const [uploadError, setUploadError] = useState(null);

    const handleFileChange = (e) => {
        setUploadError(null);

        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];

            // Validate file type
            if (!file.type.startsWith("image/")) {
                setUploadError("Please select an image file (JPEG, PNG, etc.)");
                return;
            }

            // Validate file size (max 10MB)
            if (file.size > 10 * 1024 * 1024) {
                setUploadError("File size must be less than 10MB");
                return;
            }

            setSelectedFile(file);
            const fileUrl = URL.createObjectURL(file);
            setPreviewUrl(fileUrl);
            setPreviewStatus(true);
        }
    };

    const handleRemoveFile = () => {
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }
        setSelectedFile(null);
        setPreviewUrl(null);
        setPreviewStatus(false);
        setUploadError(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setUploadError(null);

        if (!selectedFile) {
            setUploadError("Please select a file first");
            return;
        }

        handleUploadPhoto(e);
    };

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + " Bytes";
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
        return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    };

    if (!isAccessToEdit) return null;

    return (
        <>
            <form onSubmit={handleSubmit} className="image-upload-form">
                <div className="image-upload-form__container">
                    <input
                        ref={fileInputRef}
                        id="image-upload"
                        type="file"
                        onChange={handleFileChange}
                        className="image-upload-form__input"
                        accept="image/*"
                        disabled={isUploading}
                    />
                    <label
                        htmlFor="image-upload"
                        className="image-upload-form__label"
                    >
                        <svg
                            className="image-upload-form__icon"
                            viewBox="0 0 24 24"
                        >
                            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                        </svg>
                        Upload Photo
                    </label>
                </div>

                {selectedFile && (
                    <div className="image-upload-form__file-info">
                        <div>
                            <div className="image-upload-form__file-name">
                                {selectedFile.name}
                            </div>
                            <div className="image-upload-form__file-size">
                                {formatFileSize(selectedFile.size)}
                            </div>
                        </div>
                        <button
                            type="button"
                            className="image-upload-form__remove"
                            onClick={handleRemoveFile}
                            disabled={isUploading}
                            aria-label="Remove selected file"
                        >
                            <svg
                                className="image-upload-form__remove-icon"
                                viewBox="0 0 24 24"
                            >
                                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                            </svg>
                        </button>
                    </div>
                )}

                {selectedFile && !isUploading && (
                    <button
                        type="submit"
                        className={`image-upload-form__submit ${isUploading ? "image-upload-form__submit--loading" : ""}`}
                        disabled={isUploading}
                    >
                        <svg
                            className="image-upload-form__submit-icon"
                            viewBox="0 0 24 24"
                        >
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                        </svg>
                        {isUploading ? "Uploading..." : "Upload"}
                    </button>
                )}

                {uploadError && (
                    <div className="image-upload-form__error">
                        <div className="image-upload-form__error-text">
                            {uploadError}
                        </div>
                    </div>
                )}
            </form>

            <ImageUploadViewer
                previewStatus={previewStatus}
                setPreviewStatus={setPreviewStatus}
                handleUploadPhoto={handleSubmit}
                setSelectedFile={setSelectedFile}
                fileInputRef={fileInputRef}
                previewUrl={previewUrl}
                setPreviewUrl={setPreviewUrl}
                selectedFile={selectedFile}
                isUploading={isUploading}
                uploadError={uploadError}
            />
        </>
    );
}
