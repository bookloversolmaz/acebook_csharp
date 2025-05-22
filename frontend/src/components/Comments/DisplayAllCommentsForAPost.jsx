import { useState, useEffect } from 'react';
// import * as usersService from "../../services/users";
import { getCommentsByPostId } from "../../services/comments";
import CreateCommentForm from "./CreateCommentForm";
import IndividualCommentDisplay from "./IndividualCommentDisplay"

// Props are postId and token
const DisplayAllCommentsForAPost = (props) => {
    const[comments, setComments] = useState([]);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const postId = props.postId;
                const data = await getCommentsByPostId(props.token, postId);
                setComments(data.comments);
            } catch (error) {
            console.error("Error fetching comments:", error);
            }
        };
        fetchComments();
    }, [props.postId, props.token]);

    // handle the creation of a new comment
    const handleNewComment = (newComment) => {
        setComments((prevComments) => [newComment, ...prevComments]);
    };
    
    return (
        <>
            <h6 className="mt-4 mb-0 fw-bold text-start">Comments</h6>
            <CreateCommentForm token={props.token} onCommentCreated={handleNewComment} postId={props.postId} />
            <div className="feed" role="feed">
                {comments.map((comment) => (
                <IndividualCommentDisplay comment={comment} key={comment._id} token={props.token} />
                ))}
            </div>
        </>
    );
};

export default DisplayAllCommentsForAPost;
