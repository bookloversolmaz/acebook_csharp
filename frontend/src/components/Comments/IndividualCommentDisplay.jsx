import { useState, useEffect } from 'react';
import * as usersService from "../../services/users"

// Props is the comment and a token
const IndividualCommentDisplay = (props) => {
    const[username, setUsername] = useState('');
    const[profilePicture, setProfilePicture] = useState('');
    
    const createdAtISO = props.comment.createdAt;
    const date = new Date(createdAtISO);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // months are 0-indexed
    const year = String(date.getFullYear()).slice(-2); // get last two digits
    const hours   = String(date.getHours()).padStart(2, '0');     // 00-23
    const minutes = String(date.getMinutes()).padStart(2, '0');   // 00-59

    const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}`

    useEffect(() => {
        const fetchUsername = async () => {
            try {
                const commenterUserId = props.comment.userId;
                const data = await usersService.getUserById(props.token, commenterUserId);
                setUsername(data.user.username);
                setProfilePicture(data.user.profilePicture);
            } catch (error) {
            console.error("Error fetching user:", error);
            }
        };
        fetchUsername();
    }, [props.comment.userId, props.token]);

    return (
        <article className="card mb-3 shadow-sm border-primary bg-light">  
        {/* key={props.comment._id}> This was the end of the article opening tag above */}
        <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-0">
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <img src={`${profilePicture}`} data-testid="comment-profilepicture" className="mb-0 rounded-circle"
                    style={{ width: "20px", height: "20px", objectFit: "cover" }} /> 
                <h6 className="card-title mb-0 ms-2 fw-bold" data-testid="comment-username">{username}</h6>
                </div>
                <p data-testid="comment-createdAt" className="mb-0 text-muted" style={{fontSize: "0.75rem"}}>{formattedDate}</p>
            </div>
            <div data-testid="comment-message">
                <p className="card-text mt-1 mb-0 text-start" style={{fontSize: "0.9rem"}}>{props.comment.message}</p>
            </div>
        </div>
        </article>);
};

export default IndividualCommentDisplay;
