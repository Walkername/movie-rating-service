import NavigationBar from "../../components/navigation/navigation-bar/navigation-bar";
import MovieList from "../../components/movie-catalog/movie-list/movie-list";
import "./main-page.css";

function MainPage() {
    return (
        <div className="main-page">
            <NavigationBar />

            <div className="main-page__content">
                <div className="main-page__header">
                    <h1 className="main-page__title">Movie Cluster</h1>
                    <p className="main-page__subtitle">
                        Discover, rate, and discuss thousands of movies. Find
                        your next favorite film in our curated collection.
                    </p>
                </div>

                <div className="main-page__catalog">
                    <MovieList />
                </div>
            </div>
        </div>
    );
}

export default MainPage;
