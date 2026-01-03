import { useCallback } from "react";
import { useEffect } from "react";

export default function ImageViewer({
    isAccessToEdit,
    viewStatus,
    setViewStatus,
    selectedPhoto,
    setSelectedPhoto,
    additionalActions = []
}) {
    const closeViewer = useCallback(() => {
        setViewStatus(false);
        setTimeout(() => {
            setSelectedPhoto(null);
        }, 300);
    }, [setSelectedPhoto, setViewStatus])

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
    }, [viewStatus, closeViewer]);

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
                                {
                                    additionalActions.map((action, index) => {
                                        return isAccessToEdit &&
                                            (
                                                <button
                                                    key={index}
                                                    onClick={() => action.handler(selectedPhoto)}
                                                    className="action-button"
                                                >
                                                    {action.label}
                                                </button>
                                            )
                                    })
                                }

                            </div>
                        </div>
                    </div>
                )}
        </>
    );
}