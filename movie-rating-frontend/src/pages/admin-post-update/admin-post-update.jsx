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
    const [submitSuccess, setSubmitSuccess] = useState(false);

    // Constants
    const TITLE_LIMIT = 50;
    const CONTENT_LIMIT = 500;

    // Load post data on component mount
    useEffect(() => {
        const loadPostData = async () => {
            try {
                const postData = await getPost(id);
                setPost({
                    title: postData.title || "",
                    content: postData.content || "",
                    id: id,
                });
                setOriginalPost(postData);
            } catch (error) {
                console.error("Failed to load post:", error);
                setSubmitError("Failed to load post. Please try again.");
                setTimeout(() => navigate("/admin/posts-tool"), 2000);
            } finally {
                setIsLoading(false);
            }
        };

        loadPostData();
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
        if (submitSuccess) setSubmitSuccess(false);
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
        if (!originalPost) return false;
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
        setSubmitSuccess(false);

        try {
            await updatePost(id, {
                title: post.title.trim(),
                content: post.content.trim(),
            });

            setSubmitSuccess(true);

            // Update original post with new values
            setOriginalPost({
                ...originalPost,
                title: post.title.trim(),
                content: post.content.trim(),
            });

            // Navigate back after delay
            setTimeout(() => {
                navigate("/admin/posts-tool");
            }, 1500);
        } catch (error) {
            console.error("Failed to update post:", error);
            setSubmitError(
                error.message || "Failed to update post. Please try again.",
            );
        } finally {
            setIsSubmitting(false);
        }
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
        setSubmitSuccess(false);
    };

    // Cancel and go back
    const handleCancel = () => {
        if (hasChanges()) {
            if (
                window.confirm(
                    "You have unsaved changes. Are you sure you want to leave?",
                )
            ) {
                navigate("/admin/posts-tool");
            }
        } else {
            navigate("/admin/posts-tool");
        }
    };

    // Handle key shortcuts
    const handleKeyDown = (e) => {
        // Save on Ctrl+S or Cmd+S
        if ((e.ctrlKey || e.metaKey) && e.key === "s") {
            e.preventDefault();
            if (hasChanges() && post.title.trim() && post.content.trim()) {
                handleSubmit(e);
            }
        }

        // Cancel on Escape
        if (e.key === "Escape") {
            handleCancel();
        }
    };

    // Preview markdown
    const renderPreview = () => {
        if (!post.content)
            return (
                <div className="preview-placeholder">
                    <div className="placeholder-icon">👀</div>
                    <p>Start typing to see preview...</p>
                </div>
            );

        return (
            <div className="markdown-preview">
                <h3>Preview:</h3>
                <div className="preview-content">
                    <h4>{post.title || "Untitled Post"}</h4>
                    <div
                        dangerouslySetInnerHTML={{
                            __html: post.content
                                .replace(/\n/g, "<br>")
                                .replace(
                                    /\*\*(.*?)\*\*/g,
                                    "<strong>$1</strong>",
                                )
                                .replace(/\*(.*?)\*/g, "<em>$1</em>")
                                .replace(/`(.*?)`/g, "<code>$1</code>")
                                .replace(/^### (.*$)/gm, "<h3>$1</h3>")
                                .replace(/^## (.*$)/gm, "<h2>$1</h2>")
                                .replace(/^# (.*$)/gm, "<h1>$1</h1>"),
                        }}
                    />
                </div>
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
        <div
            className="update-post-container"
            onKeyDown={handleKeyDown}
            tabIndex={0}
        >
            <div className="update-post-header">
                <button
                    onClick={handleCancel}
                    className="post-update-back-button"
                    type="button"
                >
                    ← Back to Posts
                </button>
                <h2>Update Post</h2>
                <p className="subtitle">Edit your post content</p>
            </div>

            <form onSubmit={handleSubmit} className="update-post-form">
                {/* Title Field */}
                <div className="form-group">
                    <label htmlFor="title">
                        Title *
                        <span
                            className={`char-counter ${post.title.length > TITLE_LIMIT * 0.8 ? "warning" : ""}`}
                        >
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
                        <span
                            className={`char-counter ${post.content.length > CONTENT_LIMIT * 0.8 ? "warning" : ""}`}
                        >
                            {post.content.length}/{CONTENT_LIMIT}
                        </span>
                    </label>
                    <div className="content-editor-container">
                        <textarea
                            id="content"
                            name="content"
                            value={post.content}
                            onChange={handleChange}
                            placeholder="Write your post content here... You can use markdown: **bold**, *italic*, `code`, # headers

Ctrl+S to save • Ctrl+Enter to update • Esc to cancel"
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

                    <div className="markdown-tips">
                        <h4>Markdown Tips:</h4>
                        <ul>
                            <li>
                                <code>**bold**</code> → <strong>bold</strong>
                            </li>
                            <li>
                                <code>*italic*</code> → <em>italic</em>
                            </li>
                            <li>
                                <code>`code`</code> → <code>code</code>
                            </li>
                            <li>
                                <code># Header 1</code> → Large header
                            </li>
                            <li>
                                <code>## Header 2</code> → Medium header
                            </li>
                        </ul>
                    </div>
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

                {/* Success Message */}
                {submitSuccess && (
                    <div className="submit-success">
                        <span className="success-icon">✅</span>
                        Post updated successfully! Redirecting...
                    </div>
                )}

                {/* Submit Error */}
                {submitError && (
                    <div className="submit-error">
                        <span className="error-icon">❌</span>
                        {submitError}
                    </div>
                )}

                {/* Keyboard shortcuts hint */}
                <div className="keyboard-shortcuts">
                    <span className="shortcut">Ctrl+S</span> Save •
                    <span className="shortcut"> Ctrl+Enter</span> Update •
                    <span className="shortcut"> Esc</span> Cancel
                </div>

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
