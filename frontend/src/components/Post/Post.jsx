import { useState, useEffect } from 'react';
import * as usersService from "../../services/users";
import DisplayAllCommentsForAPost from "../Comments/DisplayAllCommentsForAPost";

// Props are: post={post} key={post._id} token={token}; 
const Post = (props) => {
  const[username, setUsername] = useState('');
  const[profilePicture, setProfilePicture] = useState('');
  
  const createdAtISO = props.post.createdAt
  const date = new Date(createdAtISO)

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // months are 0-indexed
  const year = String(date.getFullYear()).slice(-2); // get last two digits
  const hours   = String(date.getHours()).padStart(2, '0');     // 00-23
  const minutes = String(date.getMinutes()).padStart(2, '0');   // 00-59

  const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}`

  useEffect(() => {
      const fetchUsername = async () => {
        try {
            const posterUserId = props.post.userId;
            const data = await usersService.getUserById(props.token, posterUserId);
            setUsername(data.user.username);
            setProfilePicture(data.user.profilePicture);
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      };
      fetchUsername();
  }, [props.post.userId, props.token]);


  
  return (
    <article className="card mb-3 shadow-sm border-primary bg-light" data-testid="post-article">
      <div className="card-body">
        <div className="card-body shadow border-primary bg-white">
          <div className="d-flex justify-content-between align-items-center mb-2">
              <h5 className="card-title mb-0 fw-bold" data-testid="post-username">{username}</h5>
              <img src={`${profilePicture}`} data-testid="post-profilepicture" className="mb-0 rounded-circle"
                  style={{ width: "32px", height: "32px", objectFit: "cover" }} />              
              <p data-testid="post-createdAt" className="mb-0 text-muted small">{formattedDate}</p>
          </div>
          <div >
              <p className="card-text mt-4 mb-0 text-start" data-testid="post-message">{props.post.message}</p>
          </div>
        </div>
          <DisplayAllCommentsForAPost token={props.token} postId={props.post._id}/>
      </div>
    </article>);
};

export default Post;
