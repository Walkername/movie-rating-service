import { useEffect, useState } from "react";
import NavigationBar from "../../components/navigation/navigation-bar/navigation-bar";
import { downloadFiles } from "../../api/file-api";
import { Link, useParams } from "react-router-dom";
import "../../styles/user-photo-catalog.css";
import ImageGallery from "../../components/image-gallery/image-gallery";
import ImageUploadForm from "../../components/image-upload-form/image-upload-form";

export default function UserPhotoCatalog() {
    const { id } = useParams();

    const [photos, setPhotos] = useState([]);
    useEffect(() => {
        downloadFiles("user", id)
            .then((data) => {
                setPhotos(data);
            });
    }, []);

    return (
        <>
            <NavigationBar />

            <div>
                <h1>Photo Catalog</h1>
            </div>

            <div className="page-content-container">
                <div className="page-content">
                    <div>
                        <div className="header-actions">
                            <Link to={`/user/${id}`} className="back-button">
                                ← Back to Profile
                            </Link>

                            <ImageUploadForm id={id} />
                        </div>

                        <ImageGallery photos={photos} />
                    </div>
                </div>
            </div >
        </>
    )
}
