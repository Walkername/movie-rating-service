import { useCallback, useEffect, useState } from "react";
import "./image-upload-viewer.css";

export default function ImageUploadViewer({
    previewStatus,
    setPreviewStatus,
    handleUploadPhoto,
    setSelectedFile,
    fileInputRef,
    previewUrl,
    setPreviewUrl,
    selectedFile = null,
    isUploading = false,
    uploadError = null
}) {
    const [localSelectedFile, setLocalSelectedFile] = useState(selectedFile);
    const [isClosing, setIsClosing] = useState(false);

    const closePreview = useCallback(() => {
        setIsClosing(true);
        
        setTimeout(() => {
            setPreviewStatus(false);
            setSelectedFile(null);
            setLocalSelectedFile(null);

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }

            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
                setPreviewUrl(null);
            }
            
            setIsClosing(false);
        }, 300);
    }, [setPreviewStatus, setSelectedFile, fileInputRef, previewUrl, setPreviewUrl]);

    useEffect(() => {
        const handleEsc = (event) => {
            if (event.key === 'Escape' && previewStatus && !isUploading) {
                closePreview();
            }
        };

        window.addEventListener("keydown", handleEsc);

        return () => {
            window.removeEventListener("keydown", handleEsc);
            
            // Cleanup preview URL on unmount
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewStatus, closePreview, isUploading, previewUrl]);

    // Update local state when selectedFile prop changes
    useEffect(() => {
        if (selectedFile) {
            setLocalSelectedFile(selectedFile);
        }
    }, [selectedFile]);

    if (!previewStatus) return null;

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const modalClass = `image-upload-modal ${previewStatus ? 'image-upload-modal--active' : ''} ${isClosing ? 'image-upload-modal--closing' : ''}`;

    return (
        <div 
            className={modalClass}
            onClick={!isUploading ? closePreview : undefined}
            role="dialog"
            aria-modal="true"
            aria-label="Image upload preview"
        >
            <div
                className="image-upload-modal__content"
                onClick={(e) => e.stopPropagation()}
            >
                <button 
                    className="image-upload-modal__close"
                    onClick={closePreview}
                    disabled={isUploading}
                    aria-label="Close preview"
                >
                    ×
                </button>
                
                <div className="image-upload-modal__header">
                    <h3 className="image-upload-modal__title">Image Preview</h3>
                    {localSelectedFile && (
                        <div className="image-upload-modal__info">
                            <div className="image-upload-modal__filename">
                                {localSelectedFile.name}
                            </div>
                            <div className="image-upload-modal__filesize">
                                {formatFileSize(localSelectedFile.size)}
                            </div>
                        </div>
                    )}
                </div>

                {uploadError && (
                    <div className="image-upload-modal__error">
                        <div className="image-upload-modal__error-text">
                            {uploadError}
                        </div>
                    </div>
                )}

                {isUploading ? (
                    <div className="image-upload-modal__loading">
                        <div className="image-upload-modal__spinner"></div>
                        <div className="image-upload-modal__loading-text">
                            Uploading image...
                        </div>
                    </div>
                ) : (
                    <>
                        {previewUrl && (
                            <div className="image-upload-modal__preview">
                                <img
                                    src={previewUrl}
                                    alt="Preview"
                                    className="image-upload-modal__image"
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/800x600/333/666?text=Image+Preview+Error';
                                    }}
                                />
                            </div>
                        )}

                        <div className="image-upload-modal__actions">
                            <button
                                onClick={handleUploadPhoto}
                                className="image-upload-modal__button image-upload-modal__button--confirm"
                                disabled={isUploading || !localSelectedFile}
                            >
                                <svg 
                                    className="image-upload-modal__icon" 
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                </svg>
                                Upload Image
                            </button>
                            
                            <button
                                onClick={closePreview}
                                className="image-upload-modal__button image-upload-modal__button--cancel"
                                disabled={isUploading}
                            >
                                <svg 
                                    className="image-upload-modal__icon" 
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                                </svg>
                                Cancel
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}