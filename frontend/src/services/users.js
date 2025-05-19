const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const getUserById = async (token, userId) => {
    const requestOptions = {
        method: "GET",
        headers: {
        Authorization: `Bearer ${token}`,
        },
    };

    const response = await fetch(`${BACKEND_URL}/users/getuserbyid?id=${userId}`, requestOptions);

    if (response.status !== 200) {
        throw new Error("Unable to fetch user");
    }

    const data = await response.json();
    return data;
};