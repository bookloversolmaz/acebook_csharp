// components: reusable pieces of React code. returns id and message
import { useState, useEffect } from 'react';
// import {getUserById} from "../../services/users";
import * as usersService from "../../services/users"

// TODO: include datetime
const Post = (props) => {
  const[username, setUsername] = useState('');
  const createdAtISO = props.post.createdAt
  const date = new Date(createdAtISO)

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // months are 0-indexed
  const year = String(date.getFullYear()).slice(-2); // get last two digits

  const formattedDate = `${day}/${month}/${year}`

  useEffect(() => {
      const fetchUsername = async () => {
        try {
            const posterUserId = props.post.userId;
            const data = await usersService.getUserById(props.token, posterUserId);
            console.log(`Here is the username: ${data.user.username}`);
            setUsername(data.user.username);
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      };
      fetchUsername();
  }, [props.post.userId, props.token]);

  return (
    <article className="card mb-3 shadow-sm border-primary bg-light" key={props.post._id}>
      <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-2">
              <h5 className="card-title mb-0 fw-bold" data-testid="post-username">{username}</h5>              
                  <p data-testid="post-createdAt" className="mb-0 text-muted small">{formattedDate}</p>
          </div>
          <div data-testid="post-message">
              <p className="card-text mt-4 mb-0 text-start">{props.post.message}</p>
          </div>
      </div>
    </article>);
  // Include datetime in component
};

export default Post;
