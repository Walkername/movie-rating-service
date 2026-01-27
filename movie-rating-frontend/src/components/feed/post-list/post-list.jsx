import { useEffect, useState } from "react";
import Post from "../post/post";
import "./post-list.css";
import { getPosts } from "../../../api/feed-api";

export default function PostList() {
    const [posts, setPosts] = useState({
        content: [],
        limit: 10,
        page: 0,
        totalElements: 0,
        totalPages: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        getPosts(0, 10)
            .then((data) => {
                setPosts(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error(error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="post-list-container">
                <div className="post-list-loading">
                    <div className="post-list-spinner"></div>
                    <div>Loading posts...</div>
                </div>
            </div>
        );
    }

    if (posts.content.length === 0) {
        return (
            <div className="post-list-container">
                <div className="post-list-empty">
                    No posts yet. Be the first to share something!
                </div>
            </div>
        );
    }

    return (
        <div className="post-list-container">
            {posts.content.map((post, index) => (
                <Post key={post.id || index} post={post} />
            ))}
        </div>
    );
}
