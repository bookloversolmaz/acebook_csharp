import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "../../services/profile";
import Username from "../../components/UserDetails/Username";

export const ProfilePage = () => {
    // const [posts, setPosts] = useState([]);
    // const [message, setMessage] = useState("");
    const [user, setUser] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            getUser(token)
                .then((data) => {
                console.log(data.user.Username)
                setUser(data.user.Username);
                localStorage.setItem("token", data.token);
                })
                .catch((err) => {
                console.error(err);
                navigate("/login");
                });
            }
        }, [navigate]);
    
    return (
        <>
        <Username Username={user.Username} key={user._id}/>
        </>
    )
}