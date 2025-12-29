import NavigationBar from '../../components/navigation/navigation-bar/navigation-bar';
import TopUser from '../../components/top-user/top-user';
import MovieList from '../../components/movie-catalog/movie-list/movie-list';
import PostListPreview from '../../components/feed/post-list-preview/post-list-preview';

function MainPage() {

    return (
        <>
            <NavigationBar />

            <div className="background-page">
                <h1>Main Page</h1>
                <div className="main-page-content">
                    <div>
                        <TopUser />

                        <hr></hr>
                        
                        <MovieList />
                        
                        <hr></hr>
                        
                        <PostListPreview />
                    </div>
                </div>
            </div>
        </>

    )
}

export default MainPage;