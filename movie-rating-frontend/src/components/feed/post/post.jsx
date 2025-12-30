import { useState } from "react";
import ReactMarkdown from "react-markdown";
import validateDate from "../../../utils/date-validation/date-validation";
import CommentList from "../post-comment-list/post-comment-list";
import PostFunctionPanel from "../post-function-panel/post-function-panel";
import "./post.css";

export default function Post({ post }) {
    const briefContent =
        post.content.length <= 100
            ? post.content
            : post.content.substring(0, 100) + "...";
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
            <span className="post-date">{validateDate(post.publishedAt)}</span>
            <h2 className="post-title">{post.title}</h2>
            <div className="post-content">
                <ReactMarkdown
                    components={{
                        // Downscale all headers by one level
                        h1: ({ node, ...props }) => <h3 {...props} />,
                        h2: ({ node, ...props }) => <h4 {...props} />,
                        h3: ({ node, ...props }) => <h5 {...props} />,
                    }}
                >
                    {contentShown}
                </ReactMarkdown>
            </div>
            {post.content.length > 100 && (
                <p
                    className="post-content-show-more"
                    onClick={toggleContentShown}
                >
                    {showMoreText}
                </p>
            )}
            <PostFunctionPanel onClickComment={() => toggleCommentSection()} postId={post.id} />
            {commentSection && <CommentList />}
        </div>
    );
}
