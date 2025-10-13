import { useRef, useState } from "react";
import "../../../styles/movie-details-edit.css";
import { updateMovie } from "../../../api/admin-movie-api";
import { uploadFile } from "../../../api/admin-file-api";
import DeleteButton from "../delete-button/delete-button";
import ImageUploadViewer from "../../image-upload-viewer/image-upload-viewer";
import "../../../styles/user-photo-catalog.css";

function MovieDetailsEdit({ isAccessToEdit, movie, handleEdit }) {
    const [errorTitle, setErrorTitle] = useState("");
    const [errorDescription, setErrorDescription] = useState("");
    const [errorReleaseYear, setErrorReleaseYear] = useState("");

    const [formData, setFormData] = useState({
        title: movie.title,
        releaseYear: movie.releaseYear,
        description: movie.description
    });

    const validateTitle = () => {
        let errors = "";
        errors += formData.title.length === 0 ? "Title should not be empty;" : "";
        errors += formData.title.length > 50 ? "Title should be less or equal than 50;" : "";

        if (errors !== "") {
            setErrorTitle(errors);
            return false;
        }

        return true;
    };

    const validateDescription = () => {
        if (formData.description.length > 500) {
            setErrorDescription("Description should be less or equal than 500");
            return false;
        } else {
            return true;
        }
    };

    const validateReleaseYear = () => {
        if (formData.releaseYear < 0) {
            setErrorReleaseYear("Release year cannot be negative")
            return false;
        } else {
            return true;
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleUpdate = (evt) => {
        evt.preventDefault();

        if (validateTitle()
            && validateDescription()
            && validateReleaseYear()
        ) {
            updateMovie(movie.id, formData)
                .then(() => {
                    setErrorTitle("");
                    setErrorDescription("");
                    setErrorReleaseYear("");
                    window.location.reload();
                })
                .catch((error) => {
                    setErrorDescription("Some error has occured");
                })
        }
    };

    // MOVIE POSTER
    // ImageUploadViewer
    const [previewStatus, setPreviewStatus] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setSelectedFile(file);

            const fileUrl = URL.createObjectURL(file);
            setPreviewUrl(fileUrl);
            setPreviewStatus(true);
        }
    };

    const handleUploadMoviePoster = (evt) => {
        evt.preventDefault();

        if (!selectedFile) return;

        const formData = new FormData();
        formData.append("file", selectedFile);

        // Uploading file
        uploadFile(formData, "movie-poster", movie.id)
            .then(() => {
                if (previewUrl) {
                    URL.revokeObjectURL(previewUrl);
                }
                setPreviewStatus(false);
                setSelectedFile(null);
                setPreviewUrl(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
                window.location.reload();
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <div className="edit-container">
            <div className="edit-container-top-bar">
                <DeleteButton id={movie.id} />
                {
                    isAccessToEdit &&
                    <div>
                        <button className="edit-button" onClick={handleEdit}>
                            Back
                        </button>
                    </div>
                }
            </div>
            <div className="edit-card">
                <h3>Movie Poster</h3>
                {
                    selectedFile && (
                        <img
                            className="edit-poster"
                            src={URL.createObjectURL(selectedFile)}
                            alt={selectedFile.name}
                        />
                    )
                }
                <form onSubmit={handleUploadMoviePoster} className="upload-form">
                    <div className="file-input-container">
                        <input
                            ref={fileInputRef}
                            id="movie-poster"
                            type="file"
                            onChange={handleFileChange}
                            className="file-input"
                            accept="/image/*"
                        />
                        <label htmlFor="movie-poster" className="file-input-label">
                            Choose Photo
                        </label>
                    </div>

                </form>
            </div>

            <form onSubmit={handleUpdate}>
                <div className="edit-card">
                    <h3>Title:</h3>
                    <input
                        type="text"
                        min="1"
                        max="50"
                        name="title"
                        placeholder="title"
                        value={formData.title}
                        onChange={handleChange} required
                    />
                    {errorTitle !== "" && <p className="error-text">{errorTitle}</p>}

                    <h3>Release Year:</h3>
                    <input
                        type="number"
                        name="releaseYear"
                        min="0"
                        placeholder="2000"
                        value={formData.releaseYear}
                        onChange={handleChange} required
                    />
                    {errorReleaseYear !== "" && <p style={{ color: "red" }}>{errorReleaseYear}</p>}

                    <h3>Description:</h3>
                    <textarea
                        type="text"
                        max="500"
                        name="description"
                        rows="5"
                        placeholder="..."
                        value={formData.description}
                        onChange={handleChange}
                        required
                    ></textarea>
                    {errorDescription !== "" && <span style={{ color: "red" }}>{errorDescription}</span>}

                    <button type="submit" className="edit-btn">Update</button>
                </div>
            </form>

            <ImageUploadViewer
                previewStatus={previewStatus}
                setPreviewStatus={setPreviewStatus}
                handleUploadPhoto={handleUploadMoviePoster}
                setSelectedFile={setSelectedFile}
                fileInputRef={fileInputRef}
                previewUrl={previewUrl}
                setPreviewUrl={setPreviewUrl}
            />
        </div>
    );
}

export default MovieDetailsEdit;