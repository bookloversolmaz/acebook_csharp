// pages: represent specific views of application where each page has its own URL
// FeedPage: gets info from posts tables and displays it
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { getPosts } from "../../services/posts";
import Post from "../../components/Post/Post";
import CreatePostForm from "../../components/Post/CreatePostForm"

// Component definition
export const FeedPage = () => {
  const [posts, setPosts] = useState([]);
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

  // handle the creation of a new post
  const handleNewPost = (newPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
  };

// Create a new post form within the feed page. Render the component
  return (
    <>
      <CreatePostForm token={token} onPostCreated={handleNewPost} />
      <h2 className="mt-5 mb-3 fw-bold">Posts</h2>
      <div className="feed" role="feed">
        {posts.map((post) => (
          <Post post={post} key={post._id} token={token} />
        ))}
      </div>
    </>
  );
};