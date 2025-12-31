import validateDate from "../../../utils/date-validation/date-validation";

export default function PostComment({ comment }) {
    return (
        <div className="post-comment">
            <div className="post-comment-title">
                <span className="post-comment-username">
                    <b>{comment.username}</b>
                </span>{" "}
                <span className="post-comment-date">
                    {validateDate(comment.publishedAt)}
                </span>
            </div>
            <div className="post-comment-content">
                {comment.content}
            </div>
        </div>
    );
}