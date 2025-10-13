import NavigationBar from '../../components/navigation/navigation-bar/navigation-bar';
import TopUser from '../../components/top-user/top-user';
import MovieList from '../../components/movie-catalog/movie-list/movie-list';

function MainPage() {

    return (
        <>
            <NavigationBar />

            <div className="background-page">
                <h1>Main Page</h1>
                <div className="main-page-content">
                    <div>
                        <TopUser />

                        <MovieList />
                    </div>
                </div>
            </div>
        </>

    )
}

export default MainPage;