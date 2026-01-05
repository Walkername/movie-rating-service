import validateDate from "../../../utils/date-validation/date-validation";
import "./post-comment.css";

export default function PostComment({ comment }) {
    // Форматирование даты
    const formattedDate = validateDate(comment.publishedAt);
    
    // Определяем, является ли комментарий свежим (менее 1 часа назад)
    const isRecent = () => {
        const commentDate = new Date(comment.publishedAt);
        const now = new Date();
        const diffInHours = (now - commentDate) / (1000 * 60 * 60);
        return diffInHours < 1;
    };

    return (
        <div className="post-comment">
            <div className="post-comment-title">
                <span className="post-comment-username">
                    <b>{comment.username}</b>
                </span>
                <span className="post-comment-date">
                    {formattedDate}{" "}
                    {isRecent() && (
                        <span className="post-comment-recent-badge" title="Recently posted">
                            NEW
                        </span>
                    )}
                </span>
            </div>
            <div className="post-comment-content">
                {comment.content}
            </div>
        </div>
    );
}