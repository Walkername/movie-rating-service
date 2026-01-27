import { useState } from "react";
import ReactMarkdown from "react-markdown";
import validateDate from "../../../utils/date-validation/date-validation";
import PostCommentSection from "../post-comment-section/post-comment-section";
import PostFunctionPanel from "../post-function-panel/post-function-panel";
import "./post.css";

export default function Post({ post }) {
    const briefContent =
        post.content.length <= 300
            ? post.content
            : post.content.substring(0, 200) + "...";
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
        <article className="post-container">
            <span className="post-date">{validateDate(post.publishedAt)}</span>
            <h2 className="post-title">{post.title}</h2>
            <div className="post-content">
                <ReactMarkdown
                    components={{
                        h1: ({ node, children, ...props }) =>
                            children ? <h3 {...props}>{children}</h3> : null,
                        h2: ({ node, children, ...props }) =>
                            children ? <h4 {...props}>{children}</h4> : null,
                        h3: ({ node, children, ...props }) =>
                            children ? <h5 {...props}>{children}</h5> : null,
                    }}
                >
                    {contentShown}
                </ReactMarkdown>
            </div>
            {post.content.length > 300 && (
                <p
                    className="post-content-show-more"
                    onClick={toggleContentShown}
                    role="button"
                    tabIndex={0}
                    onKeyPress={(e) =>
                        e.key === "Enter" && toggleContentShown()
                    }
                >
                    {showMoreText}
                </p>
            )}
            <PostFunctionPanel
                onClickComment={() => toggleCommentSection()}
                postId={post.id}
            />
            {commentSection && <PostCommentSection postId={post.id} />}
        </article>
    );
}
