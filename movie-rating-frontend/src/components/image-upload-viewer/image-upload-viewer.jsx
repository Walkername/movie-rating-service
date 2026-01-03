import { useCallback } from "react";
import { useEffect } from "react";

export default function ImageUploadViewer({
    previewStatus,
    setPreviewStatus,
    handleUploadPhoto,
    setSelectedFile,
    fileInputRef,
    previewUrl,
    setPreviewUrl,
}) {
    const closePreview = useCallback(() => {
        setPreviewStatus(false);
        setTimeout(() => {
            setSelectedFile(null);

            // Copy ref value to variable to avoid cleanup issues
            const currentFileInput = fileInputRef.current;
            if (currentFileInput) {
                currentFileInput.value = "";
            }

            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
            setPreviewUrl(null);
        }, 300);
    }, [
        setPreviewStatus,
        setSelectedFile,
        fileInputRef,
        previewUrl,
        setPreviewUrl,
    ]);

    useEffect(() => {
        const handleEsc = (event) => {
            if (event.keyCode === 27) {
                if (previewStatus) closePreview();
            }
        };
        window.addEventListener("keydown", handleEsc);
        const currentFileInput = fileInputRef.current;

        return () => {
            window.removeEventListener("keydown", handleEsc);

            if (currentFileInput) {
                currentFileInput.value = "";
            }

            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewStatus, closePreview, fileInputRef, previewUrl]);

    return (
        <>
            {previewStatus && (
                <div className="photo-modal-overlay" onClick={closePreview}>
                    <div
                        className="photo-modal-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button className="close-button" onClick={closePreview}>
                            ×
                        </button>
                        {previewUrl && (
                            <img
                                src={previewUrl}
                                alt="Preview"
                                className="fullscreen-photo"
                            />
                        )}
                        <div className="photo-actions">
                            <button
                                onClick={handleUploadPhoto}
                                className="upload-confirm-button"
                            >
                                Upload Photo
                            </button>
                            <button
                                onClick={closePreview}
                                className="cancel-button"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
