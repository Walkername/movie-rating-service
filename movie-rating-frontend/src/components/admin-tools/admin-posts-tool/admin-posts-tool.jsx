import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../../../api/admin-feed-api";
import "./admin-posts-tool.css";

export default function AdminPostsTool() {
    const navigate = useNavigate();
    
    // Form state
    const [post, setPost] = useState({
        title: "",
        content: ""
    });
    
    // Validation and UI state
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");
    
    // Constants
    const TITLE_LIMIT = 50;
    const CONTENT_LIMIT = 500;
    
    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Validate length as user types
        if (name === "title" && value.length > TITLE_LIMIT) return;
        if (name === "content" && value.length > CONTENT_LIMIT) return;
        
        setPost(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ""
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
    
    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        setIsSubmitting(true);
        setSubmitError("");
        
        try {
            // API call to create post
            const response = await createPost({
                title: post.title.trim(),
                content: post.content.trim()
            });
            
            // Success - navigate to feed
            console.log("Post created successfully:", response);
            navigate("/feed");
            
        } catch (error) {
            console.error("Failed to create post:", error);
            setSubmitError(error.message || "Failed to create post. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };
    
    // Reset form
    const handleReset = () => {
        setPost({ title: "", content: "" });
        setErrors({});
        setSubmitError("");
    };
    
    // Preview markdown (basic)
    const renderPreview = () => {
        if (!post.content) return <p className="preview-placeholder">Start typing to see preview...</p>;
        
        return (
            <div className="markdown-preview">
                <h3>Preview:</h3>
                <div dangerouslySetInnerHTML={{ 
                    __html: post.content
                        .replace(/\n/g, '<br>')
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replace(/\*(.*?)\*/g, '<em>$1</em>')
                        .replace(/`(.*?)`/g, '<code>$1</code>')
                        .replace(/^### (.*$)/gm, '<h3>$1</h3>')
                        .replace(/^## (.*$)/gm, '<h2>$1</h2>')
                        .replace(/^# (.*$)/gm, '<h1>$1</h1>')
                }} />
            </div>
        );
    };
    
    return (
        <div className="create-post-container">
            <form onSubmit={handleSubmit} className="create-post-form">
                <div className="create-post-header">
                    <h2>Create New Post</h2>
                    <p className="subtitle">Share updates with your audience</p>
                </div>
                
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
                        className={`form-input ${errors.title ? 'error' : ''}`}
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
                            className={`markdown-editor ${errors.content ? 'error' : ''}`}
                            maxLength={CONTENT_LIMIT}
                            rows={12}
                            disabled={isSubmitting}
                        />

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
                    <div className="preview-container">
                        {renderPreview()}
                    </div>
                </div>
                
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
                        onClick={handleReset}
                        className="btn btn-secondary"
                        disabled={isSubmitting || (!post.title && !post.content)}
                    >
                        Clear
                    </button>
                    
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isSubmitting || !post.title.trim() || !post.content.trim()}
                    >
                        {isSubmitting ? (
                            <>
                                <span className="spinner"></span>
                                Publishing...
                            </>
                        ) : (
                            "Publish Post"
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}