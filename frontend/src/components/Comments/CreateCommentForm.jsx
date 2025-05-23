import { useState } from 'react';
import { createComment } from "../../services/comments"

const CreateCommentForm = ({token, onCommentCreated, postId }) => {
    const[message, setMessage] = useState('');

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await createComment(token, message, postId);
            onCommentCreated(response.comment)
            setMessage("");
        } catch (err) {
        console.error("Error creating comment:", err);
        }
    };

    const handleMessageChange = (event) => {
        setMessage(event.target.value);
    };

    return (
        <div className="mt-0">
            <form onSubmit={handleSubmit} className="mb-2 mt-0">
                <label htmlFor="Message" className="form-label"></label>
                <div className="d-flex">
                    <input
                    id="Message"
                    aria-label="Comment Message"
                    type="text"
                    className="form-control me-2"
                    value={message}
                    onChange={handleMessageChange}
                    placeholder="comment here..."
                    style={{ fontSize: "0.875rem" }}
                    />
                    <button className="mt-2 btn btn-primary" id="submit" type="submit" value="Submit">Comment</button>
                </div>
            </form>
        </div>
    )
};

export default CreateCommentForm;
