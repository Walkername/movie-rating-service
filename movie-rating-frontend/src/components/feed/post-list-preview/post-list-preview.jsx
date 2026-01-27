import { Link } from "react-router-dom";
import PostList from "../post-list/post-list";
import "./post-list-preview.css";

export default function PostListPreview() {
    return (
        <div className="post-list-preview-container">
            <h2>News Feed</h2>

            <PostList />

            <Link to="/feed" className="move-to-feed-button">
                <span>Move to Feed</span>
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                >
                    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                </svg>
            </Link>
        </div>
    );
}
