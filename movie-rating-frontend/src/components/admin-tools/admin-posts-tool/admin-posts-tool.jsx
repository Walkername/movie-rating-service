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
    const [submitSuccess, setSubmitSuccess] = useState(false);
    
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
    
    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        setIsSubmitting(true);
        setSubmitError("");
        setSubmitSuccess(false);
        
        try {
            await createPost({
                title: post.title.trim(),
                content: post.content.trim()
            });
            
            // Success
            setSubmitSuccess(true);
            
            // Reset form after delay
            setTimeout(() => {
                setPost({ title: "", content: "" });
                setSubmitSuccess(false);
                
                // Optional: navigate to feed
                // navigate("/feed");
            }, 2000);
            
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
        setSubmitSuccess(false);
    };
    
    // Preview markdown (basic)
    const renderPreview = () => {
        if (!post.content) return (
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
            </div>
        );
    };

    const handleKeyDown = (e) => {
        // Submit on Ctrl+Enter or Cmd+Enter
        if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
            e.preventDefault();
            if (post.title.trim() && post.content.trim()) {
                handleSubmit(e);
            }
        }
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
                        <span className={`char-counter ${post.title.length > TITLE_LIMIT * 0.8 ? 'warning' : ''}`}>
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
                        <span className={`char-counter ${post.content.length > CONTENT_LIMIT * 0.8 ? 'warning' : ''}`}>
                            {post.content.length}/{CONTENT_LIMIT}
                        </span>
                    </label>
                    <div className="content-editor-container">
                        <textarea
                            id="content"
                            name="content"
                            value={post.content}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            placeholder="Write your post content here... You can use markdown: **bold**, *italic*, `code`, # headers
                            
Ctrl+Enter to publish"
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
                    
                    <div className="markdown-tips">
                        <h4>Markdown Tips:</h4>
                        <ul>
                            <li><code>**bold**</code> → <strong>bold</strong></li>
                            <li><code>*italic*</code> → <em>italic</em></li>
                            <li><code>`code`</code> → <code>code</code></li>
                            <li><code># Header 1</code> → Large header</li>
                            <li><code>## Header 2</code> → Medium header</li>
                        </ul>
                    </div>
                </div>
                
                {/* Preview Section */}
                <div className="form-group">
                    <div className="preview-container">
                        {renderPreview()}
                    </div>
                </div>
                
                {/* Success Message */}
                {submitSuccess && (
                    <div className="submit-success">
                        <span className="success-icon">✅</span>
                        Post created successfully! Redirecting...
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
                            'Publish Post'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}