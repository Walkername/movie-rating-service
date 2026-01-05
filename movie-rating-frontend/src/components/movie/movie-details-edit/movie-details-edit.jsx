import { useRef, useState } from "react";
import "./movie-details-edit.css";
import { updateMovie } from "../../../api/admin-movie-api";
import { uploadFile } from "../../../api/admin-file-api";
import DeleteButton from "../delete-button/delete-button";
import ImageUploadViewer from "../../image-upload-viewer/image-upload-viewer";

function MovieDetailsEdit({ isAccessToEdit, movie, handleEdit }) {
    const [errorTitle, setErrorTitle] = useState("");
    const [errorDescription, setErrorDescription] = useState("");
    const [errorReleaseYear, setErrorReleaseYear] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const [formData, setFormData] = useState({
        title: movie.title,
        releaseYear: movie.releaseYear,
        description: movie.description,
    });

    const validateTitle = () => {
        let errors = "";
        if (formData.title.length === 0) errors = "Title should not be empty";
        if (formData.title.length > 50)
            errors = "Title should be 50 characters or less";

        setErrorTitle(errors);
        return !errors;
    };

    const validateDescription = () => {
        if (formData.description.length > 500) {
            setErrorDescription("Description should be 500 characters or less");
            return false;
        }
        setErrorDescription("");
        return true;
    };

    const validateReleaseYear = () => {
        if (formData.releaseYear < 0) {
            setErrorReleaseYear("Release year cannot be negative");
            return false;
        }
        if (formData.releaseYear > new Date().getFullYear() + 10) {
            setErrorReleaseYear("Release year seems unrealistic");
            return false;
        }
        setErrorReleaseYear("");
        return true;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        const newValue = name === "releaseYear" ? parseInt(value) || 0 : value;
        setFormData({ ...formData, [name]: newValue });

        // Валидация в реальном времени
        if (name === "title") validateTitle();
        if (name === "description") validateDescription();
        if (name === "releaseYear") validateReleaseYear();
    };

    const handleUpdate = (evt) => {
        evt.preventDefault();

        if (validateTitle() && validateDescription() && validateReleaseYear()) {
            setIsSubmitting(true);

            updateMovie(movie.id, formData)
                .then(() => {
                    // Успешное обновление
                    window.location.reload();
                })
                .catch((error) => {
                    console.error("Update error:", error);
                    setErrorDescription("An error occurred while updating");
                    setIsSubmitting(false);
                });
        }
    };

    // MOVIE POSTER UPLOAD
    const [previewStatus, setPreviewStatus] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];

            // Проверка типа файла
            if (!file.type.startsWith("image/")) {
                alert("Please select an image file");
                return;
            }

            // Проверка размера (макс 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert("File size should be less than 5MB");
                return;
            }

            setSelectedFile(file);
            const fileUrl = URL.createObjectURL(file);
            setPreviewUrl(fileUrl);
            setPreviewStatus(true);
        }
    };

    const handleUploadMoviePoster = (evt) => {
        evt.preventDefault();

        if (!selectedFile) return;

        setIsUploading(true);
        const uploadFormData = new FormData();
        uploadFormData.append("file", selectedFile);

        uploadFile(uploadFormData, "movie-poster", movie.id)
            .then(() => {
                // Очистка предпросмотра
                if (previewUrl) {
                    URL.revokeObjectURL(previewUrl);
                }
                setPreviewStatus(false);
                setSelectedFile(null);
                setPreviewUrl(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
                setIsUploading(false);

                // Перезагрузка страницы для отображения нового постера
                window.location.reload();
            })
            .catch((error) => {
                console.error("Upload error:", error);
                setIsUploading(false);
            });
    };

    const handleCancelUpload = () => {
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }
        setPreviewStatus(false);
        setSelectedFile(null);
        setPreviewUrl(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const isFormValid = !errorTitle && !errorDescription && !errorReleaseYear;

    return (
        <div className="movie-edit">
            <div className="movie-edit__header">
                <h2 className="movie-edit__title">Edit Movie: {movie.title}</h2>
                <div className="movie-edit__actions">
                    <button
                        className="movie-edit__button movie-edit__button--back"
                        onClick={handleEdit}
                        type="button"
                    >
                        ← Back to Movie
                    </button>
                </div>
            </div>

            {/* Секция загрузки постера */}
            <div className="movie-edit__card">
                <h3 className="movie-edit__card-title">Movie Poster</h3>
                <div className="movie-edit__poster-section">
                    {selectedFile ? (
                        <div className="movie-edit__poster-preview">
                            <img src={previewUrl} alt="Poster preview" />
                        </div>
                    ) : (
                        <p className="movie-edit__file-info">
                            Current poster is displayed on the movie page
                        </p>
                    )}

                    <div className="movie-edit__file-upload">
                        <input
                            ref={fileInputRef}
                            id="movie-poster"
                            type="file"
                            onChange={handleFileChange}
                            className="movie-edit__file-input"
                            accept="image/*"
                        />
                        <label
                            htmlFor="movie-poster"
                            className="movie-edit__file-label"
                        >
                            Choose New Poster
                        </label>

                        {selectedFile && (
                            <div className="movie-edit__upload-actions">
                                <button
                                    type="button"
                                    className="movie-edit__upload-button"
                                    onClick={handleUploadMoviePoster}
                                    disabled={isUploading}
                                >
                                    {isUploading
                                        ? "Uploading..."
                                        : "Upload Poster"}
                                </button>
                                <button
                                    type="button"
                                    className="movie-edit__button movie-edit__button--back"
                                    onClick={handleCancelUpload}
                                    style={{ marginTop: "var(--spacing-sm)" }}
                                >
                                    Cancel
                                </button>
                            </div>
                        )}

                        {selectedFile && (
                            <p className="movie-edit__file-info">
                                Selected: {selectedFile.name} (
                                {Math.round(selectedFile.size / 1024)} KB)
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Форма редактирования деталей */}
            <form onSubmit={handleUpdate}>
                <div className="movie-edit__card">
                    <h3 className="movie-edit__card-title">Movie Details</h3>

                    <div className="movie-edit__field">
                        <label className="movie-edit__label" htmlFor="title">
                            Title *
                        </label>
                        <input
                            className="movie-edit__input"
                            id="title"
                            type="text"
                            name="title"
                            placeholder="Movie title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            maxLength={50}
                        />
                        <div className="movie-edit__char-count">
                            {formData.title.length}/50 characters
                        </div>
                        {errorTitle && (
                            <div className="movie-edit__error">
                                {errorTitle}
                            </div>
                        )}
                    </div>

                    <div className="movie-edit__field">
                        <label
                            className="movie-edit__label"
                            htmlFor="releaseYear"
                        >
                            Release Year *
                        </label>
                        <input
                            className="movie-edit__input"
                            id="releaseYear"
                            type="number"
                            name="releaseYear"
                            placeholder="e.g., 2023"
                            value={formData.releaseYear}
                            onChange={handleChange}
                            required
                            min="1888"
                            max={new Date().getFullYear() + 10}
                        />
                        {errorReleaseYear && (
                            <div className="movie-edit__error">
                                {errorReleaseYear}
                            </div>
                        )}
                    </div>

                    <div className="movie-edit__field">
                        <label
                            className="movie-edit__label"
                            htmlFor="description"
                        >
                            Description *
                        </label>
                        <textarea
                            className="movie-edit__textarea"
                            id="description"
                            name="description"
                            placeholder="Movie description..."
                            value={formData.description}
                            onChange={handleChange}
                            required
                            maxLength={500}
                            rows={5}
                        />
                        <div className="movie-edit__char-count">
                            {formData.description.length}/500 characters
                        </div>
                        {errorDescription && (
                            <div className="movie-edit__error">
                                {errorDescription}
                            </div>
                        )}
                    </div>

                    <div className="movie-edit__actions">
                        <button
                            type="submit"
                            className="movie-edit__button movie-edit__button--update"
                            disabled={!isFormValid || isSubmitting}
                        >
                            {isSubmitting ? "Updating..." : "Update Movie"}
                        </button>
                    </div>
                </div>
            </form>

            {/* Секция удаления */}
            <div className="movie-edit__delete-section">
                <DeleteButton id={movie.id} movieTitle={movie.title} />
            </div>

            {/* Модальное окно загрузки (если используется) */}
            <ImageUploadViewer
                previewStatus={previewStatus}
                setPreviewStatus={setPreviewStatus}
                handleUploadPhoto={handleUploadMoviePoster}
                setSelectedFile={setSelectedFile}
                fileInputRef={fileInputRef}
                previewUrl={previewUrl}
                setPreviewUrl={setPreviewUrl}
                selectedFile={selectedFile}
                isUploading={isUploading}
            />
        </div>
    );
}

export default MovieDetailsEdit;
