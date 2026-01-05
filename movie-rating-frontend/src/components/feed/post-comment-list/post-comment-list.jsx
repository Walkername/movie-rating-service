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
        totalPages: 0,
    });

    useEffect(() => {
        getAllCommentsForPost(postId)
            .then((data) => {
                setComments(data);
            })
            .catch((error) => {
                console.error("Error fetching comments:", error);
            });
    }, [postId, refreshTrigger]);

    return (
        comments.content.length !== 0 && (
            <div className="post-comments">
                {comments.content.map((comment) => (
                    <PostComment key={comment.id} comment={comment} />
                ))}
            </div>
        )
    );
}
