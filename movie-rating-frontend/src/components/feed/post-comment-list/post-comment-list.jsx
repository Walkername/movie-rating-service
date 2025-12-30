import PostCommentInput from "../post-comment-input/post-comment-input";
import PostComment from "../post-comment/comment";

export default function CommentList() {
    return (
        <div className="post-comment-section">
            <div className="post-comments">
                <PostComment />
            </div>

            <hr></hr>
            <PostCommentInput />
        </div>
    );
}