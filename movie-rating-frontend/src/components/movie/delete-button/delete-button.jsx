import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteMovie } from "../../../api/admin-movie-api";
import "./delete-button.css";

function DeleteButton({ id, movieTitle = "this movie" }) {
    const navigate = useNavigate();
    const [showConfirm, setShowConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState(null);

    const handleDelete = () => {
        setIsDeleting(true);
        setError(null);

        deleteMovie(id)
            .then(() => {
                // Показываем сообщение об успехе на короткое время
                setTimeout(() => {
                    navigate("/", {
                        state: {
                            message: `"${movieTitle}" was successfully deleted`,
                            messageType: "success",
                        },
                    });
                }, 500);
            })
            .catch((error) => {
                console.error("Delete error:", error);
                setError(
                    error.message ||
                        "Failed to delete movie. Please try again.",
                );
                setIsDeleting(false);
                setShowConfirm(false);
            });
    };

    const handleConfirm = () => {
        handleDelete();
    };

    const handleCancel = () => {
        setShowConfirm(false);
        setError(null);
    };

    const handleButtonClick = () => {
        setShowConfirm(true);
    };

    return (
        <>
            <button
                className={`delete-button ${isDeleting ? "delete-button--loading" : ""}`}
                onClick={handleButtonClick}
                disabled={isDeleting}
                aria-label={`Delete ${movieTitle}`}
            >
                {!isDeleting && (
                    <>
                        <svg
                            className="delete-button__icon"
                            viewBox="0 0 24 24"
                        >
                            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                        </svg>
                        Delete Movie
                    </>
                )}
            </button>

            {showConfirm && (
                <div
                    className={`delete-confirm-modal ${showConfirm ? "delete-confirm-modal--active" : ""}`}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="delete-confirm-title"
                >
                    <div
                        className="delete-confirm-modal__content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="delete-confirm-modal__icon">
                            <svg
                                width="32"
                                height="32"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                            >
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                            </svg>
                        </div>

                        <h3
                            className="delete-confirm-modal__title"
                            id="delete-confirm-title"
                        >
                            Delete Movie
                        </h3>

                        <div className="delete-confirm-modal__warning">
                            ⚠ This action cannot be undone
                        </div>

                        <p className="delete-confirm-modal__message">
                            Are you sure you want to delete{" "}
                            <strong>"{movieTitle}"</strong>? All ratings,
                            photos, and related data will be permanently
                            removed.
                        </p>

                        {error && (
                            <div className="delete-confirm-modal__error">
                                <div className="delete-confirm-modal__error-text">
                                    {error}
                                </div>
                            </div>
                        )}

                        <div className="delete-confirm-modal__actions">
                            <button
                                className="delete-confirm-modal__button delete-confirm-modal__button--cancel"
                                onClick={handleCancel}
                                disabled={isDeleting}
                                aria-label="Cancel deletion"
                            >
                                Cancel
                            </button>
                            <button
                                className="delete-confirm-modal__button delete-confirm-modal__button--confirm"
                                onClick={handleConfirm}
                                disabled={isDeleting}
                                aria-label="Confirm deletion"
                            >
                                {isDeleting ? (
                                    <>
                                        <span className="delete-confirm-modal__spinner"></span>
                                        Deleting...
                                    </>
                                ) : (
                                    "Yes, Delete"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default DeleteButton;
