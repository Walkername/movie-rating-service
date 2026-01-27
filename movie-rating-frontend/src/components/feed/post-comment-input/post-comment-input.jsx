import { useState, useEffect } from "react";
import { publishComment } from "../../../api/post-comment-api";
import getClaimFromToken from "../../../utils/token-validation/token-validation";
import "./post-comment-input.css";

export default function PostCommentInput({ postId, onCommentPublished }) {
    const token = localStorage.getItem("accessToken");
    const tokenUsername =
        token !== null ? getClaimFromToken(token, "username") : null;
    const isAuth = tokenUsername ? true : false;

    const [comment, setComment] = useState({
        content: "",
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [charCount, setCharCount] = useState(0);
    const CONTENT_LIMIT = 500;

    // Real-time validation
    useEffect(() => {
        const newErrors = {};

        if (!comment.content.trim()) {
            newErrors.content = "Comment cannot be empty";
        } else if (comment.content.length > CONTENT_LIMIT) {
            newErrors.content = `Comment cannot exceed ${CONTENT_LIMIT} characters`;
        }

        setErrors(newErrors);
    }, [comment.content]);

    const handleChange = (e) => {
        const value = e.target.value;

        if (value.length > CONTENT_LIMIT) return;

        setComment((prev) => ({
            ...prev,
            content: value,
        }));
        setCharCount(value.length);
    };

    const handleSend = () => {
        // Validate before sending
        const newErrors = {};

        if (!comment.content.trim()) {
            newErrors.content = "Comment cannot be empty";
        } else if (comment.content.trim().length < 3) {
            newErrors.content = "Comment must be at least 3 characters";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsSubmitting(true);

        const commentForm = {
            content: comment.content.trim(),
        };

        publishComment(postId, commentForm)
            .then((data) => {
                console.log("Comment published:", data);
                // Clear input on success
                setComment({ content: "" });
                setCharCount(0);
                setErrors({});

                if (onCommentPublished) {
                    onCommentPublished(data);
                }
            })
            .catch((error) => {
                console.error("Error publishing comment:", error);
                // Set API errors
                setErrors((prev) => ({
                    ...prev,
                    api:
                        error.response?.data?.message ||
                        "Failed to publish comment",
                }));
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    const handleKeyDown = (e) => {
        // Submit on Ctrl+Enter or Cmd+Enter
        if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
            e.preventDefault();
            handleSend();
        }
    };

    const isFormValid =
        comment.content.trim().length >= 3 &&
        comment.content.length <= CONTENT_LIMIT &&
        comment.content.trim() !== "";

    if (!isAuth) {
        return (
            <div className="post-comment-input">
                <div className="comment-input-wrapper">
                    <textarea
                        className="post-comment-input-field"
                        placeholder="Please log in to leave a comment..."
                        disabled
                        rows={4}
                    />
                    <div className="comment-input-footer">
                        <div className="char-counter">
                            <span>0/{CONTENT_LIMIT}</span>
                        </div>
                        <button className="send-button" disabled>
                            Login to Comment
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="post-comment-input">
            <div className="post-comment-input-username">
                <b>{tokenUsername}</b>
            </div>

            <div className="comment-input-wrapper">
                <textarea
                    className={`post-comment-input-field ${errors.content ? "error" : ""}`}
                    placeholder="Type your comment..."
                    value={comment.content}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    disabled={isSubmitting}
                    rows={4}
                />

                <div className="comment-input-footer">
                    <div className="char-counter">
                        <span
                            className={
                                charCount > CONTENT_LIMIT * 0.9 ? "warning" : ""
                            }
                        >
                            {charCount}/{CONTENT_LIMIT}
                        </span>
                    </div>

                    <button
                        className="send-button"
                        onClick={handleSend}
                        disabled={!isFormValid || isSubmitting}
                    >
                        {isSubmitting ? "Publishing..." : "Send"}
                    </button>
                </div>

                {errors.content && (
                    <div className="error-message">{errors.content}</div>
                )}

                {errors.api && (
                    <div className="error-message api-error">{errors.api}</div>
                )}
            </div>
        </div>
    );
}
