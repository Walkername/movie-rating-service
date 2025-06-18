import NavigationBar from '../../components/navigation/navigation';
import TopUser from '../../components/top-user/top-user';
import MovieList from '../../components/movie-list/movie-list';

function MainPage() {

    return (
        <>
            <NavigationBar />
            <div>
                <h1>Main Page</h1>
            </div>

            <div className="page-content-container">
                <div className="page-content">
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