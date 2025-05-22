import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserById } from "../../services/users";
import Username from "../../components/UserDetails/Username";
import ProfilePicture from "../../components/UserDetails/ProfilePicture";
import CreatePostForm from "../../components/Post/CreatePostForm";
import Post from "../../components/Post/Post";
import { getPosts } from "../../services/posts";
import { jwtDecode } from "jwt-decode";


export const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();
 
    useEffect(() => {
        // const token = localStorage.getItem("token");
        // if (token) {   
        //     try {
        //         const decoded = jwtDecode(token);
        //         const userId = decoded.nameid;
                
        //         getUserById(token, userId)
        //             .then((data) =>
        //                 {
        //                 setUser(data.user);
        //                 localStorage.setItem("token", data.token);
        //                 })
                        
        //         .catch((err) => {
        //             console.error(err);
        //             navigate("/login");
        //         });
        //     } 
        //     catch (err) 
        //     {
        //         console.error("Invalid token", err);
        //         navigate("/login");
        //     }
        // } 
        // else {
        //         navigate("/login");
        //     }
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        const fetchUserAndPosts = async () => {
            try {
                
                const decoded = jwtDecode(token);
                const userId = decoded.nameid || decoded.sub || decoded.userId;
                
                
                const userData = await getUserById(token, userId);
                setUser(userData.user);
                localStorage.setItem("token", userData.token);
                
                // Fetch posts and filter for current user
                const postsData = await getPosts(token);

                if (postsData && postsData.posts) {
                    const userPosts = postsData.posts.filter(post => 
                        post.userId == userId
                    );
                    setPosts(userPosts);
                    localStorage.setItem("token", postsData.token);
                } else {
                    console.warn("No posts data received");
                    setPosts([]);
                }
                
            } catch (err) {
                console.error("Error fetching user data or posts:", err);
                navigate("/login");
            } 
        };

        fetchUserAndPosts();
    }, [navigate]);

    const handleNewPost = (newPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
    };
    
    const token = localStorage.getItem("token");

    return (
        <>
        {user && <Username username={user.username} />}
        {user && <ProfilePicture profilePicture={user.profilePicture} />}
        {user && <CreatePostForm token={token} onPostCreated={handleNewPost}/> }
        <p className="mt-5 mb-3 fw-bold">Posts</p>
        <div className="feed" role="feed" >
        {posts.map((post) => (
          <Post key={post._id} post={post} token={token} /> 
         ))} 
       </div>
        </>
    )
}
