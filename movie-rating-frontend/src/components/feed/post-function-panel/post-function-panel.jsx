import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { deletePost } from "../../../api/admin-feed-api";
import "./post-function-panel.css";

export default function PostFunctionPanel({ onClickComment, postId }) {
    const navigate = useNavigate();
    
    const [showMenu, setShowMenu] = useState(false);
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
        setShowMenu(false);
        deletePost(postId)
            .catch((error) => console.log(error));
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

    return (
        <div className="post-function-panel">
            <span className="post-function-like">Like</span>
            <span
                className="post-function-comment"
                onClick={onClickComment}
            >
                Comment
            </span>
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
                            Update
                        </button>
                        <button 
                            className="post-function-menu-item post-function-menu-delete"
                            onClick={handleDelete}
                        >
                            Delete
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}