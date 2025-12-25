import PostList from "../../components/feed/post-list/post-list";
import Post from "../../components/feed/post/post";
import NavigationBar from "../../components/navigation/navigation-bar/navigation-bar";
import "./feed-page.css";

export default function FeedPage() {
    return (
        <>
            <NavigationBar />

            <div className="background-page">
                <div className="feed-container">
                    <PostList />
                </div>
            </div>
            
        </>
    );
};