import { useState } from "react";
import "./post.css";

export default function Post({ post }) {
    const briefContent = post.content.length <= 100 ? post.content : post.content.substring(0, 100) + "...";
    const [contentShown, setContentShown] = useState(briefContent);
    const [toggleContent, setToggleContent] = useState(false);
    const [showMoreText, setShowMoreText] = useState("Show more");
    const toggleContentShown = () => {
        if (toggleContent) {
            setContentShown(briefContent);
            setToggleContent(!toggleContent);
            setShowMoreText("Show more");
        } else {
            setContentShown(post.content);
            setToggleContent(!toggleContent);
            setShowMoreText("Hide");
        }
    };


    const [commentSection, setCommentSection] = useState(false);

    const toggleCommentSection = () => {
        setCommentSection(!commentSection);
    };

    return (
        <div className="post-container">
            <span className="post-date">25.01.2025</span>
            <h2 className="post-title">My Story</h2>
            <div className="post-content">
                {contentShown}
                
            </div>
            {
                post.content.length > 100 && <p className="post-content-show-more" onClick={toggleContentShown}>{showMoreText}</p>
            }
            <div className="post-function-panel">
                <span className="post-function-like">Like</span>
                <span className="post-function-comment" onClick={toggleCommentSection}>Comment</span>
                <span className="post-function-more">More...</span>
            </div>
            {
                commentSection &&
                <div className="post-comment-section">
                    <div className="post-comments">
                        <div className="post-comment">
                            <div className="post-comment-title"><span className="post-comment-username"><b>User123</b></span> <span className="post-comment-date">25.01.2025 13:01</span></div>
                            <div className="post-comment-content">Hello, It's not so bad! You can continue your journey.</div>
                        </div>
                    </div>

                    <hr></hr>
                    <div className="post-comment-input">
                        <div className="post-comment-input-username"><b>walkername</b></div>
                        <textarea className="post-comment-input-field" placeholder="Type your comment"></textarea>
                        <br></br>
                        <input type="submit" value="Send" />
                    </div>
                </div>
            }
        </div>
    );
}