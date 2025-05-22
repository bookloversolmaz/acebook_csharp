// docs: https://vitejs.dev/guide/env-and-mode.html
// services: encapsulate communication with the backend, through fetch requests
// posts.js: gets existing posts using tokens
// TODO: create post method for post form
// import 
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const getCommentsByPostId = async (token, postId) => {
    const requestOptions = {
        method: "GET",
        headers: {
        Authorization: `Bearer ${token}`,
        },
    };

    const response = await fetch(`${BACKEND_URL}/comments/getcommentsbypostid?id=${postId}`, requestOptions);

    if (response.status !== 200) {
        throw new Error("Unable to fetch comments");
    }

    const data = await response.json();
    return data;
    };


export const createComment = async (token, message, postId) => {
    const commentData = {
        PostId: postId,
        Message: message,
    };
    const requestOptions = {
        method: "POST",
        headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json" //body is a json
        },
        body: JSON.stringify(commentData)
    };

    const request = await fetch(`${BACKEND_URL}/comments`, requestOptions); //Browser suggests

    if (request.status !== 201) {
        throw new Error("Unable to fetch posts");
    }

    const data = await request.json();
    return data;
};