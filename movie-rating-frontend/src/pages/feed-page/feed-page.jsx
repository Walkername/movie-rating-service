import PostList from "../../components/feed/post-list/post-list";
import NavigationBar from "../../components/navigation/navigation-bar/navigation-bar";
import "./feed-page.css";

export default function FeedPage() {
    return (
        <>
            <NavigationBar />

            <div className="background-page">
                <div className="feed-container">
                    <h1 className="post-list-container-title">News Feed</h1>
                    <PostList />
                </div>
            </div>
            
        </>
    );
};