import { useState } from 'react';
import { createPost } from "../../services/posts"

const CreatePostForm = ({token, onPostCreated }) => {
    const[message, setMessage] = useState('');

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await createPost(token, message);
            onPostCreated(response.post)
            setMessage("");
        } catch (err) {
        console.error("Error creating post:", err);
        }
    };

    const handleMessageChange = (event) => {
        setMessage(event.target.value);
    };

    return (
        <>
            <h2 className="mt-4 mb-3 fw-bold fst-italic">Create new post</h2>
            <form onSubmit={handleSubmit} className="mb-5">
                <label htmlFor="Message" className="form-label">Message:</label>
                <input
                id="Message"
                type="text"
                className="form-control"
                value={message}
                onChange={handleMessageChange}
                />
                <button className="mt-2 btn btn-primary" id="submit" type="submit" value="Submit">Submit</button>
            </form>
        </>
    )
};

export default CreatePostForm;
