import { useEffect } from "react";
import { useParams } from "react-router-dom";
import getClaimFromToken from "../../utils/token-validation/token-validation";

export default function ImageViewer({
    isAccessToEdit,
    viewStatus,
    setViewStatus,
    selectedPhoto,
    setSelectedPhoto,
    additionalActions = []
}) {
    const { id } = useParams();
    const token = localStorage.getItem("accessToken");
    const tokenId = getClaimFromToken(token, "id");

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