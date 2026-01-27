import { useState } from "react";
import { addMovie } from "../../../api/admin-movie-api";
import "./add-movie-form.css";

function AddMovieForm() {
    const [errorTitle, setErrorTitle] = useState("");
    const [errorDescription, setErrorDescription] = useState("");
    const [errorReleaseYear, setErrorReleaseYear] = useState("");
    const [submitSuccess, setSubmitSuccess] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [characterCount, setCharacterCount] = useState(0);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        releaseYear: "",
    });

    // Список популярных жанров (опционально)
    const popularGenres = [
        "Action",
        "Adventure",
        "Comedy",
        "Drama",
        "Horror",
        "Sci-Fi",
        "Thriller",
        "Romance",
        "Fantasy",
        "Mystery",
    ];
    const [selectedGenres, setSelectedGenres] = useState([]);

    const validateTitle = () => {
        if (formData.title.length === 0) {
            setErrorTitle("Title is required");
            return false;
        }
        if (formData.title.length > 50) {
            setErrorTitle("Title must be 50 characters or less");
            return false;
        }
        setErrorTitle("");
        return true;
    };

    const validateDescription = () => {
        if (formData.description.length > 500) {
            setErrorDescription("Description must be 500 characters or less");
            return false;
        }
        setErrorDescription("");
        return true;
    };

    const validateReleaseYear = () => {
        const year = parseInt(formData.releaseYear);
        const currentYear = new Date().getFullYear();

        if (isNaN(year)) {
            setErrorReleaseYear("Please enter a valid year");
            return false;
        }
        if (year < 1888) {
            // Первый фильм в истории
            setErrorReleaseYear("Year must be after 1888");
            return false;
        }
        if (year > currentYear + 5) {
            // Допускаем будущие релизы на 5 лет вперед
            setErrorReleaseYear(
                `Year cannot be more than 5 years in the future (max ${currentYear + 5})`,
            );
            return false;
        }
        if (year < 0) {
            setErrorReleaseYear("Release year cannot be negative");
            return false;
        }
        setErrorReleaseYear("");
        return true;
    };

    const validateAll = () => {
        const isTitleValid = validateTitle();
        const isDescriptionValid = validateDescription();
        const isYearValid = validateReleaseYear();

        return isTitleValid && isDescriptionValid && isYearValid;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        const newFormData = { ...formData, [name]: value };

        setFormData(newFormData);

        // Обновляем счетчик символов для описания
        if (name === "description") {
            setCharacterCount(value.length);
            if (value.length <= 500) {
                setErrorDescription("");
            }
        }

        // Валидация в реальном времени
        if (name === "title" && value.length > 0) {
            validateTitle();
        }
        if (name === "releaseYear" && value.length > 0) {
            validateReleaseYear();
        }

        // Сбрасываем сообщение об успехе при изменении формы
        if (submitSuccess) {
            setSubmitSuccess("");
        }
    };

    const handleGenreToggle = (genre) => {
        setSelectedGenres((prev) => {
            if (prev.includes(genre)) {
                return prev.filter((g) => g !== genre);
            } else {
                return [...prev, genre];
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateAll()) {
            return;
        }

        setIsSubmitting(true);
        setSubmitSuccess("");

        try {
            // Добавляем жанры к данным формы, если они выбраны
            const movieData = {
                ...formData,
                releaseYear: parseInt(formData.releaseYear),
                genres: selectedGenres,
            };

            const data = await addMovie(movieData);
            console.log("Movie added successfully:", data);

            // Успех
            setSubmitSuccess("Movie added successfully!");

            // Сбрасываем форму через 2 секунды
            setTimeout(() => {
                setFormData({
                    title: "",
                    description: "",
                    releaseYear: "",
                });
                setSelectedGenres([]);
                setCharacterCount(0);
                setSubmitSuccess("");
            }, 2000);
        } catch (error) {
            console.error("Error adding movie:", error);

            // Определяем тип ошибки
            if (error.response?.status === 409) {
                setErrorTitle("A movie with this title already exists");
            } else {
                setErrorTitle(
                    error.message || "Error adding movie. Please try again.",
                );
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setFormData({
            title: "",
            description: "",
            releaseYear: "",
        });
        setSelectedGenres([]);
        setCharacterCount(0);
        setErrorTitle("");
        setErrorDescription("");
        setErrorReleaseYear("");
        setSubmitSuccess("");
    };

    // Проверяем, есть ли изменения в форме
    const hasChanges = () => {
        return (
            formData.title ||
            formData.description ||
            formData.releaseYear ||
            selectedGenres.length > 0
        );
    };

    return (
        <div className="add-movie-form-container">
            <div className="form-header">
                <h2>Add New Movie</h2>
                <p className="form-subtitle">
                    Fill in the details to add a new movie to the database
                </p>
            </div>

            <form className="new-movie-form" onSubmit={handleSubmit}>
                {/* Title Field */}
                <div className="form-field-group">
                    <label htmlFor="title">
                        Movie Title{" "}
                        <span className="required-indicator">*</span>
                    </label>
                    <input
                        id="title"
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Enter movie title..."
                        className={`form-input ${errorTitle && !submitSuccess ? "error" : ""}`}
                        maxLength={50}
                        required
                        disabled={isSubmitting}
                    />
                    <div className="char-counter-wrapper">
                        <div className="char-counter">
                            {formData.title.length}/50
                        </div>
                    </div>
                    {errorTitle && !submitSuccess && (
                        <div className="error-message">{errorTitle}</div>
                    )}
                </div>

                {/* Release Year Field */}
                <div className="form-field-group">
                    <label htmlFor="releaseYear">
                        Release Year{" "}
                        <span className="required-indicator">*</span>
                    </label>
                    <input
                        id="releaseYear"
                        type="number"
                        name="releaseYear"
                        value={formData.releaseYear}
                        onChange={handleChange}
                        placeholder="Enter release year..."
                        className={`form-number ${errorReleaseYear && !submitSuccess ? "error" : ""}`}
                        min="1888"
                        max={new Date().getFullYear() + 5}
                        required
                        disabled={isSubmitting}
                    />
                    {errorReleaseYear && !submitSuccess && (
                        <div className="error-message">{errorReleaseYear}</div>
                    )}
                </div>

                {/* Description Field */}
                <div className="form-field-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Enter movie description..."
                        className={`form-textarea ${errorDescription && !submitSuccess ? "error" : ""}`}
                        maxLength={500}
                        rows={4}
                        disabled={isSubmitting}
                    />
                    <div className="char-counter-wrapper">
                        <div
                            className={`char-counter ${characterCount > 450 ? "warning" : ""}`}
                        >
                            {characterCount}/500
                        </div>
                    </div>
                    {errorDescription && !submitSuccess && (
                        <div className="error-message">{errorDescription}</div>
                    )}
                </div>

                {/* Genres Field (опционально) */}
                <div className="additional-fields">
                    <h3>Genres (Optional)</h3>
                    <div className="genres-group">
                        {popularGenres.map((genre) => (
                            <button
                                key={genre}
                                type="button"
                                className={`genre-tag ${selectedGenres.includes(genre) ? "selected" : ""}`}
                                onClick={() => handleGenreToggle(genre)}
                                disabled={isSubmitting}
                            >
                                {genre}
                            </button>
                        ))}
                    </div>
                    {selectedGenres.length > 0 && (
                        <div className="selected-genres-info">
                            <p>Selected: {selectedGenres.join(", ")}</p>
                        </div>
                    )}
                </div>

                {/* Success Message */}
                {submitSuccess && (
                    <div className="success-message">{submitSuccess}</div>
                )}

                {/* Form Actions */}
                <div className="form-actions">
                    <button
                        type="button"
                        onClick={resetForm}
                        className="form-submit secondary"
                        disabled={isSubmitting || !hasChanges()}
                        style={{
                            background:
                                "linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                            color: "var(--color-text-light)",
                            marginRight: "var(--spacing-sm)",
                        }}
                    >
                        Clear Form
                    </button>
                    <button
                        type="submit"
                        className="form-submit"
                        disabled={
                            isSubmitting ||
                            !formData.title.trim() ||
                            !formData.releaseYear.trim()
                        }
                    >
                        {isSubmitting ? (
                            <>
                                <span className="form-spinner"></span>
                                Adding Movie...
                            </>
                        ) : (
                            "Add Movie"
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AddMovieForm;
