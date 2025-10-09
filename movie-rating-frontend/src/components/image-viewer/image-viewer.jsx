import { useEffect } from "react";
import { updateMyProfilePictureId } from "../../api/user-api";

export default function ImageViewer({ 
    viewStatus, 
    setViewStatus, 
    selectedPhoto, 
    setSelectedPhoto 
}) {
    const setProfilePicture = (photoId) => {
        updateMyProfilePictureId(photoId);
    };

    const closeViewer = () => {
        setViewStatus(false);
        setTimeout(() => {
            setSelectedPhoto(null);
        }, 300);
    };

    useEffect(() => {
        const handleEsc = (event) => {
            if (event.keyCode === 27) {
                if (viewStatus) closeViewer();
            }
        };
        window.addEventListener('keydown', handleEsc);

        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, [viewStatus]);

    return (
        <>
            {
                viewStatus && selectedPhoto && (
                    <div className="photo-modal-overlay" onClick={closeViewer}>
                        <div className="photo-modal-content" onClick={(e) => e.stopPropagation()}>
                            <button className="close-button" onClick={closeViewer}>
                                ×
                            </button>
                            <img
                                src={selectedPhoto.url}
                                alt="Full screen"
                                className="fullscreen-photo"
                            />
                            <div className="photo-actions">
                                <button
                                    onClick={() => setProfilePicture(selectedPhoto.fileId)}
                                    className="action-button"
                                >
                                    Set as Profile Picture
                                </button>
                            </div>
                        </div>
                    </div>
                )}
        </>
    );
}