// docs: https://vitejs.dev/guide/env-and-mode.html
// services: encapsulate communication with the backend, through fetch requests
// posts.js: gets existing posts using tokens
// TODO: create post method for post form
// import 
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const getPosts = async (token) => {
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await fetch(`${BACKEND_URL}/posts`, requestOptions);

  if (response.status !== 200) {
    throw new Error("Unable to fetch posts");
  }

  const data = await response.json();
  return data;
};


export const createPost = async (token, message) => {
  const postMessage = {
    Message: message,
  };
  const requestOptions = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json" //body is a json
    },
    body: JSON.stringify(postMessage)
  };

  const request = await fetch(`${BACKEND_URL}/posts`, requestOptions); //Browser suggests

  if (request.status !== 201) {
    throw new Error("Unable to fetch posts");
  }

  const data = await request.json();
  return data;
};