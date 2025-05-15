// docs: https://vitejs.dev/guide/env-and-mode.html
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const login = async (email, password) => {
  const payload = {
    email: email,
    password: password,
  };

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  };

  const response = await fetch(`${BACKEND_URL}/tokens`, requestOptions);

  // docs: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/201
  if (response.status === 201) {
    let data = await response.json();
    return data.token;
  } else {
    throw new Error(
      `Received status ${response.status} when logging in. Expected 201`
    );
  }
};

export const signup = async (username, email, password) => {
  const payload = {
    username: username,
    email: email,
    password: password,
  };

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  };

  let response = await fetch(`${BACKEND_URL}/users`, requestOptions);

  // docs: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/201
  if (response.status === 201) {
    return;
  } else {
    throw new Error(
      `Received status ${response.status} when signing up. Expected 201`
    );
  }
};

export const checkUsername = async (username) => {
  const url = new URL(`${BACKEND_URL}/users/checkusername`);
  url.searchParams.append("username", username);

  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  let response = await fetch(url, requestOptions);
    console.log(`services/auth file line 70: response is ${response}`)

  if (response.status === 200) {
    const data = await response.json();
    console.log(`services/auth file line 74: data is ${data}`)
    return data.exists; // assuming the response is { exists: true/false }
  } else {
    throw new Error(
      `Received status ${response.status} when checking username. Expected 200`
    );
  }
};

export const checkEmail = async (email) => {
  const url = new URL(`${BACKEND_URL}/users/checkemail`);
  url.searchParams.append("email", email);

  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  let response = await fetch(url, requestOptions);
    console.log(`services/auth file line 95: email check response is ${response}`)

  if (response.status === 200) {
    const data = await response.json();
    console.log(`services/auth file line 100: email check data is ${data}`)
    return data.exists; // assuming the response is { exists: true/false }
  } else {
    throw new Error(
      `Received status ${response.status} when checking email. Expected 200`
    );
  }
};