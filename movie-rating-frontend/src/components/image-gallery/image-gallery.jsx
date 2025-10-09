
export default function ImageGallery({
    photos,
    onPhotoClick 
}) {
    return (
        <>
            <div className="user-photo-catalog">
                {
                    photos.map((photo, index) => {
                        return (
                            <div
                                className="photo-card"
                                key={index}
                                onClick={() => onPhotoClick(photo)}
                            >
                                <img
                                    className="user-photo"
                                    key={index}
                                    src={photo.url}
                                    alt={`Photo ${index + 1}`}
                                />
                            </div>
                        )
                    })
                }
            </div>
        </>
    );
}