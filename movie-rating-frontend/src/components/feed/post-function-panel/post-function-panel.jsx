import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { deletePost } from "../../../api/admin-feed-api";
import "./post-function-panel.css";

export default function PostFunctionPanel({ onClickComment, postId }) {
    const navigate = useNavigate();
    
    const [showMenu, setShowMenu] = useState(false);
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0); // Примерное количество лайков
    const menuRef = useRef(null);
    const moreButtonRef = useRef(null);

    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };

    const handleUpdate = () => {
        setShowMenu(false);
        navigate(`/admin/posts/update/${postId}`);
    };

    const handleDelete = () => {
        if (window.confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
            setShowMenu(false);
            deletePost(postId)
                .then(() => {
                    // Можно добавить уведомление об успешном удалении
                    window.location.reload(); // Обновляем страницу
                })
                .catch((error) => {
                    console.error("Error deleting post:", error);
                    alert("Failed to delete post. Please try again.");
                });
        }
    };

    const handleLike = () => {
        setLiked(!liked);
        setLikeCount(prev => liked ? prev - 1 : prev + 1);
        // Здесь можно добавить API вызов для лайка
    };

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                showMenu &&
                menuRef.current &&
                !menuRef.current.contains(event.target) &&
                moreButtonRef.current &&
                !moreButtonRef.current.contains(event.target)
            ) {
                setShowMenu(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showMenu]);

    // Определяем, есть ли у пользователя права администратора
    const isAdmin = () => {
        // Здесь можно добавить проверку ролей из токена
        const token = localStorage.getItem("accessToken");
        return !!token; // Временная заглушка
    };

    return (
        <div className="post-function-panel">
            <span 
                className="post-function-like"
                onClick={handleLike}
            >
                {liked ? 'Liked' : 'Like'} ({likeCount})
            </span>
            
            <span
                className="post-function-comment"
                onClick={onClickComment}
            >
                Comment
            </span>
            
            {isAdmin() && (
                <div className="post-function-more-container">
                    <span 
                        ref={moreButtonRef}
                        className="post-function-more"
                        onClick={toggleMenu}
                    >
                        More...
                    </span>
                    
                    {showMenu && (
                        <div 
                            ref={menuRef}
                            className="post-function-menu"
                        >
                            <button 
                                className="post-function-menu-item post-function-menu-update"
                                onClick={handleUpdate}
                            >
                                Update Post
                            </button>
                            <button 
                                className="post-function-menu-item post-function-menu-delete"
                                onClick={handleDelete}
                            >
                                Delete Post
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}