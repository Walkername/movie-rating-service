import ImageUploadViewer from "../image-upload-viewer/image-upload-viewer";

export default function ImageUploadForm({
    isAccessToEdit,
    handleUploadPhoto,
    previewStatus,
    setPreviewStatus,
    selectedFile,
    setSelectedFile,
    previewUrl,
    setPreviewUrl,
    fileInputRef
}) {
    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setSelectedFile(file);

            const fileUrl = URL.createObjectURL(file);
            setPreviewUrl(fileUrl);
            setPreviewStatus(true);
        }
    };

    return (
        <>
            {
                isAccessToEdit && 
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