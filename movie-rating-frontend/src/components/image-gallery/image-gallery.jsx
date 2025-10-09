import { useState } from "react";
import ImageViewer from "../image-viewer/image-viewer";

export default function ImageGallery({
    photos
}) {
    const [viewStatus, setViewStatus] = useState(false);
    const [selectedPhoto, setSelectedPhoto] = useState(null);

    const handleViewer = (photo) => {
        setSelectedPhoto(photo);
        setViewStatus(true);
    };

    return (
        <>
            <div className="user-photo-catalog">
                {
                    photos.map((photo, index) => {
                        return (
                            <div
                                className="photo-card"
                                key={index}
                                onClick={() => handleViewer(photo)}
                            >
                                <img
                                    className="user-photo"
                                    key={index}
                                    src={photo.url}
                                    alt={`Photo ${index + 1}`}
                                />
                            </div>
                        )
                    })
                }
            </div>

            <ImageViewer
                viewStatus={viewStatus}
                setViewStatus={setViewStatus}
                selectedPhoto={selectedPhoto}
                setSelectedPhoto={setSelectedPhoto}
            />
        </>
    );
}