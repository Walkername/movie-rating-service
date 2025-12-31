import { useState } from "react";
import PostCommentInput from "../post-comment-input/post-comment-input";
import PostCommentList from "../post-comment-list/post-comment-list";

export default function PostCommentSection({ postId }) {
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleCommentPublished = () => {
        setRefreshTrigger((prev) => prev + 1);
    };

    return (
        <div className="post-comment-section">
            <PostCommentList postId={postId} refreshTrigger={refreshTrigger} />

            <hr></hr>
            <PostCommentInput postId={postId} onCommentPublished={handleCommentPublished} />
        </div>
    );
}
