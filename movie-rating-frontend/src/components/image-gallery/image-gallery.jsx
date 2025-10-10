
export default function ImageGallery({
    pageResponse = {
        content: []
    },
    onPhotoClick 
}) {
    return (
        <>
            <div className="user-photo-catalog">
                {
                    pageResponse.content.map((photo, index) => {
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