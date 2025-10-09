import { useEffect } from "react";

export default function ImageUploadViewer({ 
    previewStatus, 
    setPreviewStatus, 
    handleUploadPhoto,
    setSelectedFile,
    fileInputRef,
    previewUrl,
    setPreviewUrl
}) {
    const closePreview = () => {
        setPreviewStatus(false);
        setTimeout(() => {
            setSelectedFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
            setPreviewUrl(null);
        }, 300);
    };

    useEffect(() => {
        const handleEsc = (event) => {
            if (event.keyCode === 27) {
                if (previewStatus) closePreview();
            }
        };
        window.addEventListener('keydown', handleEsc);

        return () => {
            window.removeEventListener('keydown', handleEsc);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewStatus]);

    return (
        <>
            {previewStatus && (
                <div className="photo-modal-overlay" onClick={closePreview}>
                    <div className="photo-modal-content" onClick={(e) => e.stopPropagation()}>
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