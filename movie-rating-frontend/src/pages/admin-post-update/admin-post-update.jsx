import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { updatePost } from "../../api/admin-feed-api";
import { getPost } from "../../api/feed-api";
import "./admin-post-update.css";

export default function AdminPostUpdate() {
    const { id } = useParams();
    const navigate = useNavigate();

    // Form state
    const [post, setPost] = useState({
        title: "",
        content: "",
        id: id,
    });

    // Validation and UI state
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [originalPost, setOriginalPost] = useState(null);

    // Constants
    const TITLE_LIMIT = 50;
    const CONTENT_LIMIT = 500;

    // Load post data on component mount
    useEffect(() => {
        getPost(id)
            .then((postData) => {
                setIsLoading(true);
                setPost({
                    title: postData.title || "",
                    content: postData.content || "",
                    id: id,
                });
                setOriginalPost(postData);
            })
            .catch((error) => {
                setIsLoading(true);
                console.error("Failed to load post:", error);
                setSubmitError("Failed to load post. Please try again.");
                // Optionally navigate back after 2 seconds
                setTimeout(() => navigate("/feed"), 2000);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [id, navigate]);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;

        // Validate length as user types
        if (name === "title" && value.length > TITLE_LIMIT) return;
        if (name === "content" && value.length > CONTENT_LIMIT) return;

        setPost((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }

        // Clear general submit error
        if (submitError) setSubmitError("");
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {};

        if (!post.title.trim()) {
            newErrors.title = "Title is required";
        } else if (post.title.length > TITLE_LIMIT) {
            newErrors.title = `Title must be ${TITLE_LIMIT} characters or less`;
        }

        if (!post.content.trim()) {
            newErrors.content = "Content is required";
        } else if (post.content.length > CONTENT_LIMIT) {
            newErrors.content = `Content must be ${CONTENT_LIMIT} characters or less`;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Check if form has changes
    const hasChanges = () => {
        if (!originalPost) return true;
        return (
            post.title !== originalPost.title ||
            post.content !== originalPost.content
        );
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        if (!hasChanges()) {
            setSubmitError(
                "No changes detected. Please make some changes before updating.",
            );
            return;
        }

        setIsSubmitting(true);
        setSubmitError("");

        updatePost(id, {
            title: post.title.trim(),
            content: post.content.trim(),
        })
            .then(() => {
                setTimeout(() => navigate("/feed"), 2000);
            })
            .catch((error) => {
                console.error("Failed to update post:", error);
                setSubmitError(
                    error.message || "Failed to update post. Please try again.",
                );
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    // Reset form to original values
    const handleReset = () => {
        if (originalPost) {
            setPost({
                title: originalPost.title || "",
                content: originalPost.content || "",
                id: id,
            });
        }
        setErrors({});
        setSubmitError("");
    };

    // Cancel and go back
    const handleCancel = () => {
        if (hasChanges()) {
            if (
                window.confirm(
                    "You have unsaved changes. Are you sure you want to leave?",
                )
            ) {
                navigate("/feed");
            }
        } else {
            navigate("/feed");
        }
    };

    // Preview markdown
    const renderPreview = () => {
        if (!post.content)
            return (
                <p className="preview-placeholder">
                    Start typing to see preview...
                </p>
            );

        return (
            <div className="markdown-preview">
                <h3>Preview:</h3>
                <div
                    dangerouslySetInnerHTML={{
                        __html: post.content
                            .replace(/\n/g, "<br>")
                            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                            .replace(/\*(.*?)\*/g, "<em>$1</em>")
                            .replace(/`(.*?)`/g, "<code>$1</code>")
                            .replace(/^### (.*$)/gm, "<h3>$1</h3>")
                            .replace(/^## (.*$)/gm, "<h2>$1</h2>")
                            .replace(/^# (.*$)/gm, "<h1>$1</h1>"),
                    }}
                />
            </div>
        );
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading post...</p>
            </div>
        );
    }

    return (
        <div className="update-post-container">
            <div className="update-post-header">
                <button
                    onClick={handleCancel}
                    className="post-update-back-button"
                >
                    ← Back
                </button>
                <h2>Update Post</h2>
                <p className="subtitle">Edit your post content</p>
            </div>

            <form onSubmit={handleSubmit} className="update-post-form">
                {/* Title Field */}
                <div className="form-group">
                    <label htmlFor="title">
                        Title *
                        <span className="char-counter">
                            {post.title.length}/{TITLE_LIMIT}
                        </span>
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={post.title}
                        onChange={handleChange}
                        placeholder="Enter post title..."
                        className={`form-input ${errors.title ? "error" : ""}`}
                        maxLength={TITLE_LIMIT}
                        disabled={isSubmitting}
                    />
                    {errors.title && (
                        <div className="error-message">{errors.title}</div>
                    )}
                </div>

                {/* Content Field */}
                <div className="form-group">
                    <label htmlFor="content">
                        Content (Markdown) *
                        <span className="char-counter">
                            {post.content.length}/{CONTENT_LIMIT}
                        </span>
                    </label>
                    <div className="content-editor-container">
                        <textarea
                            id="content"
                            name="content"
                            value={post.content}
                            onChange={handleChange}
                            placeholder="Write your post content here... You can use markdown: **bold**, *italic*, `code`, # headers"
                            className={`markdown-editor ${errors.content ? "error" : ""}`}
                            maxLength={CONTENT_LIMIT}
                            rows={12}
                            disabled={isSubmitting}
                        />

                        {/* Character limit warning */}
                        {post.content.length > CONTENT_LIMIT * 0.9 && (
                            <div className="limit-warning">
                                ⚠️ Approaching character limit
                            </div>
                        )}
                    </div>
                    {errors.content && (
                        <div className="error-message">{errors.content}</div>
                    )}
                </div>

                {/* Preview Section */}
                <div className="form-group">
                    <div className="preview-container">{renderPreview()}</div>
                </div>

                {/* Changes indicator */}
                {hasChanges() && (
                    <div className="changes-indicator">
                        <span className="changes-icon">✏️</span>
                        You have unsaved changes
                    </div>
                )}

                {/* Submit Error */}
                {submitError && (
                    <div className="submit-error">
                        <span className="error-icon">❌</span>
                        {submitError}
                    </div>
                )}

                {/* Action Buttons */}
                <div className="form-actions">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="btn btn-secondary"
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={handleReset}
                        className="btn btn-secondary"
                        disabled={isSubmitting || !hasChanges()}
                    >
                        Reset
                    </button>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={
                            isSubmitting ||
                            !hasChanges() ||
                            !post.title.trim() ||
                            !post.content.trim()
                        }
                    >
                        {isSubmitting ? (
                            <>
                                <span className="spinner"></span>
                                Updating...
                            </>
                        ) : (
                            "Update Post"
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
