// pages: represent specifc views of application where each page has its own URL
// FeedPage: gets info from posts tables and displays it
// TODO: Include datetime and create a post form with a post request
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { getPosts } from "../../services/posts";
import { createPost } from "../../services/posts";
import Post from "../../components/Post/Post";

export const FeedPage = () => {
  const [posts, setPosts] = useState([]);

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

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

  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/login");
    return;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await createPost(token, message);

      // Add the newly created post to the page
      // const newPost = {
      //   message: response.Message
      // };

      setPosts([response.post, ...posts]); // Add new message to existing posts using response data
      setMessage("");
      navigate("/posts");
    } catch (err) {
      console.error(err);
      navigate("/login");
    }
  };
  const handleMessageChange = (event) => {
  setMessage(event.target.value);
};
// Create a new post form within the feed page
  return (
    <>
      <h2>Create new post</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="Message">Message:</label>
        <input
          id="Message"
          type="text"
          value={message}
          onChange={handleMessageChange}
        />
        <input role="submit-button" id="submit" type="submit" value="Submit" />
      </form>
      <h2>Posts</h2>
      <div className="feed" role="feed">
        {posts.map((post) => (
          <Post post={post} key={post._id} />
        ))}
      </div>
    </>
  );
};