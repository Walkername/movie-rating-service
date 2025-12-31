import { useState } from "react";
import { useEffect } from "react";
import { getAllCommentsForPost } from "../../../api/post-comment-api";
import PostComment from "../post-comment/post-comment";

export default function PostCommentList({ postId, refreshTrigger }) {
    const [comments, setComments] = useState({
        content: [],
        page: 0,
        limit: 0,
        totalElements: 0,
        totalPages: 0
    });

    const fetchComments = () => {
        getAllCommentsForPost(postId)
            .then((data) => {
                setComments(data);
            })
            .catch((error) => {
                console.error("Error fetching comments:", error);
            });
    };

    useEffect(() => {
        fetchComments();
    }, [postId, refreshTrigger]);

    return (
        <div className="post-comments">
            {comments.length === 0 ? (
                <div className="no-comments">
                    No comments yet. Be the first to comment!
                </div>
            ) : (
                comments.content.map((comment) => (
                    <PostComment key={comment.id} comment={comment} />
                ))
            )}
        </div>
    );
}
