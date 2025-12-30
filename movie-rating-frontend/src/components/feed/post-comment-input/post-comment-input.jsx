
export default function PostCommentInput() {
    return (
        <div className="post-comment-input">
            <div className="post-comment-input-username">
                <b>walkername</b>
            </div>
            <textarea
                className="post-comment-input-field"
                placeholder="Type your comment"
            ></textarea>
            <br></br>
            <input type="submit" value="Send" />
        </div>
    );
}