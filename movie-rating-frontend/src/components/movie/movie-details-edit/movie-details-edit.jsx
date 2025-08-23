import { useState } from "react";
import { updateMovie } from "../../../api/movie-api";

function MovieDetailsEdit({ movie }) {
    const [errorTitle, setErrorTitle] = useState("");
    const [errorDescription, setErrorDescription] = useState("");
    const [errorReleaseYear, setErrorReleaseYear] = useState("");

    const [formData, setFormData] = useState({
        title: movie.title,
        releaseYear: movie.releaseYear,
        description: movie.description
    })

    const validateTitle = () => {
        let errors = "";
        errors += formData.title.length === 0 ? "Title should not be empty;" : "";
        errors += formData.title.length > 50 ? "Title should be less or equal than 50;" : "";

        if (errors !== "") {
            setErrorTitle(errors);
            return false;
        }

        return true;
    }

    const validateDescription = () => {
        if (formData.description.length > 500) {
            setErrorDescription("Description should be less or equal than 500");
            return false;
        } else {
            return true;
        }
    }

    const validateReleaseYear = () => {
        if (formData.releaseYear < 0) {
            setErrorReleaseYear("Release year cannot be negative")
            return false;
        } else {
            return true;
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }

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
    }

    return (
        <form onSubmit={handleUpdate}>
            <label>Title:</label>
            <br />
            <input type="text" min="1" max="50" name="title" placeholder="title" value={formData.title}
                onChange={handleChange} required />
            {
                errorTitle !== ""
                    ? <>
                        <br />
                        <span style={{ color: "red" }}>{errorTitle}</span>
                    </>
                    : <></>
            }
            <br />

            <label>Release year:</label>
            <br />
            <input type="number" name="releaseYear" min="0" placeholder="2000" value={formData.releaseYear}
                onChange={handleChange} required />
            {
                errorReleaseYear !== ""
                    ? <>
                        <br />
                        <span style={{ color: "red" }}>{errorReleaseYear}</span>
                    </>
                    : <></>
            }
            <br />

            <label>Description:</label>
            <br></br>
            <textarea type="text" max="500" name="description" rows="5" placeholder="..." value={formData.description}
                onChange={handleChange}
                required
            ></textarea>
            {
                errorDescription !== ""
                    ? <>
                        <br />
                        <span style={{ color: "red" }}>{errorDescription}</span>
                    </>
                    : <></>
            }
            <br />

            <input type="submit" value="Update" />
        </form>
    )
}

export default MovieDetailsEdit;