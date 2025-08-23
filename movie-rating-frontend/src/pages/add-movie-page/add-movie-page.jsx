import AddMovieForm from "../../components/admin-tools/add-movie-form/add-movie-form";
import NavigationBar from "../../components/navigation/navigation-bar/navigation-bar";

function AddMoviePage() {

    return (
        <>
            <NavigationBar />
            <div>
                <h1>Add Movie In DB</h1>
            </div>

            <div className="page-content-container">
                <div className="page-content">
                    <AddMovieForm />
                </div>
            </div>

        </>
    );
}

export default AddMoviePage;