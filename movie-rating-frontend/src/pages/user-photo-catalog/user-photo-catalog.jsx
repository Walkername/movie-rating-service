import { useEffect, useState } from "react";
import NavigationBar from "../../components/navigation/navigation-bar/navigation-bar";
import { downloadFiles, uploadMyFile, uploadUserFile } from "../../api/file-api";
import { Link, useParams } from "react-router-dom";
import "../../styles/user-photo-catalog.css";
import { updateMyProfilePictureId } from "../../api/user-api";

export default function UserPhotoCatalog() {
    const { id } = useParams();

    const [photos, setPhotos] = useState([]);
    useEffect(() => {
        downloadFiles("user", id)
            .then((data) => {
                setPhotos(data);
            });
    }, []);

    const setProfilePicture = (photoId) => {
        updateMyProfilePictureId(photoId);
    };

    // UPLOAD NEW PHOTO

    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleUploadPhoto = (evt) => {
        evt.preventDefault();

        if (!selectedFile) return;

        const formData = new FormData();
        formData.append("file", selectedFile);

        // Uploading file
        uploadMyFile(formData, "user")
            .then(() => {
                window.location.reload();
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <>
            <NavigationBar />

            <div>
                <h1>Photo Catalog</h1>
            </div>

            <div className="page-content-container">
                <div className="page-content">
                    <div>
                        <Link to={`/user/${id}`}>Back</Link>
                        <form onSubmit={handleUploadPhoto}>
                            <input id="profile-pic" type="file" onChange={handleFileChange} />
                            <button type="submit" className="edit-btn">Upload</button>
                        </form>
                    </div>
                    <div className="user-photo-catalog">
                        {
                            photos.map((photo, index) => {
                                return (
                                    <div>
                                        <img
                                            className="user-photo"
                                            key={index}
                                            src={photo.url}
                                        />
                                        <button onClick={() => setProfilePicture(photo.fileId)}>Set Profile Picture</button>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div >
        </>
    )
}
