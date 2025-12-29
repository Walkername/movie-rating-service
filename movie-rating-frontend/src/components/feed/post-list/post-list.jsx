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
        totalPages: 0
    });
    
    useEffect(() => {
        getPosts(0, 10)
            .then((data) => {
                console.log(data);
                setPosts(data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);
    
    return (
        <div className="post-list-container">
            {
                posts.content.map((post, index) => (
                    <Post key={index} post={post} />
                ))
            }
        </div>
    );
}