import { useState } from "react";
import { addMovie } from "../../api/movie-api";

function AddMovieForm() {
    const [errorTitle, setErrorTitle] = useState("");
    const [errorDescription, setErrorDescription] = useState("");
    const [errorReleaseYear, setErrorReleaseYear] = useState("");

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        releaseYear: ''
    });

    const validateTitle = () => {
        if (formData.title.length === 0) {
            setErrorTitle("Title should be greater than 0");
            return false;
        } else {
            return true;
        }
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
    };

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent the default form submission behavior

        if (validateTitle()
            && validateDescription()
            && validateReleaseYear()
        ) {
            addMovie(formData)
                .then((data) => {
                    console.log("Movie added successfully:", data);
                    alert("Movie added successfully!");
                })
                .catch((error) => {
                    console.error("Error:", error);
                    alert("Error adding movie");
                });
        }
    };

    return (
        <form className="new-movie-form" onSubmit={handleSubmit}>
            <label>Movie Title:</label>
            <br />
            <input type="text" min="1" max="50" placeholder="Title" name="title"
                value={formData.title} onChange={handleChange} required />
            {
                errorTitle !== ""
                    ? <>
                        <br />
                        <span style={{ color: "red" }}>{errorTitle}</span>
                    </>
                    : <></>
            }
            <br />

            <label>Release Year:</label>
            <br />
            <input type="number" min="0" placeholder="example, 2000" name="releaseYear"
                value={formData.releaseYear} onChange={handleChange} required />
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
            <br />
            <textarea rows="3" max="500" placeholder="..." name="description"
                value={formData.description} onChange={handleChange}
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

            <input type="submit" value="Add" />
        </form>
    );
}

export default AddMovieForm;