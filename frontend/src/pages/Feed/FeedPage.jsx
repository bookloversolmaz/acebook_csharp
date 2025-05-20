// pages: represent specifc views of application where each page has its own URL
// FeedPage: gets info from posts tables and displays it
// TODO: Include datetime and create a post form with a post request
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { getPosts } from "../../services/posts";
import { createPost } from "../../services/posts";
import Post from "../../components/Post/Post";
// Component definition
export const FeedPage = () => {
  const [posts, setPosts] = useState([]);

  const [message, setMessage] = useState("");
  const navigate = useNavigate();
// useEffect to fetch posts on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getPosts(token)
        .then((data) => {
          setPosts(data.posts);
          localStorage.setItem("token", data.token);
        })
        .catch((err) => {
          console.error(err);
          navigate("/login");
        });
    }
  }, [navigate]);
// Check if token exists
  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/login");
    return;
  }
// Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await createPost(token, message);

      setPosts([response.post, ...posts]); // Add new message to existing posts using response data
      setMessage("");
      navigate("/posts");
    } catch (err) {
      console.error(err);
      navigate("/login");
    }
  };
  // Handle message input change
  const handleMessageChange = (event) => {
  setMessage(event.target.value);
};

// Create a new post form within the feed page. Render the component
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

        <input className="mt-2 btn btn-primary" role="submit-button" id="submit" type="submit" value="Submit" />

      </form>
      <h2 className="mt-5 mb-3 fw-bold">Posts</h2>
      <div className="feed" role="feed">
        {posts.map((post) => (
          <Post post={post} key={post._id} token={token} />
        ))}
      </div>
    </>
  );
};