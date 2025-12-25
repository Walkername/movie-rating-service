import { useEffect, useState } from "react";
import Post from "../post/post";
import "./post-list.css";
import { Link } from "react-router-dom";

const POST_PROPS = [
    {
        date: "25.01.2025",
        title: "My Story",
        content: `A lot of text in this! I want to tell you about myself. It was about 5 years ago. I was a little boy with a lot of ambitions.
                But I had not abilities to achieve my dreams. So, I decided to leave my hometown and begin a new life. Firstly, I shaved my head.
                Why? Cause I wanted to feel myself a little bit lighter than ever. And what do you think? It really was helpful.
                So, whenever whoever say whatever to you, you need answer directly to their faces: "I'll do it and you can't stop me from doing it!
                Cause I'm very strong, I'm very brave and I want to do this very much". Many people just can't listen to you, because they are so stupid.
                It was my story about myself and how I can do whatever I want to do!`,
        likes: 412,
        comments: 4
    },
    {
        date: "23.01.2025",
        title: "My Story",
        content: `Do you want to hear the story about my little Pony? No? So, go away!`,
        likes: 412,
        comments: 4
    }
];

const pageResponse = {
    content: POST_PROPS,
    limit: 5,
    page: 0,
    totalElements: 6,
    totalPages: 2
}

export default function PostList({ display }) {
    const [posts, setPosts] = useState(pageResponse);
    return (
        <div className="post-list-container">
            <h2 className="post-list-container-title">News Feed</h2>
            {
                posts.content.map((post, index) => (
                    <Post key={index} post={post} />
                ))
            }
            {
                display === "main" &&
                posts.totalElements > posts.limit &&
                <Link
                    to="feed"
                    className="move-to-feed-button"
                >
                    <span>Move to Feed</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                    </svg>
                </Link>
            }
        </div>
    );
}