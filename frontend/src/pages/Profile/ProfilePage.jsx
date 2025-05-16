import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserById } from "../../services/users";
import Username from "../../components/UserDetails/Username";

export const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            getUserById(token)
                .then((data) => {
                
                console.log("ProfilePage.jsx data.user ==v");
                console.log(data.user);
                setUser(data.user);
                localStorage.setItem("token", data.token);
                })
                .catch((err) => {
                console.error(err);
                navigate("/login");
                });
            } else {
                navigate("/login");
            }
        }, [navigate]);
    
    return (
        <>
        {user && <Username Username={user.Username} key={user._id}/>}
        </>
    )
}