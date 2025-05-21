import { useState, useEffect, useLocation } from "react";
import { useNavigate } from "react-router-dom";
import { getUserById } from "../../services/users";
import Username from "../../components/UserDetails/Username";
import ProfilePicture from "../../components/UserDetails/ProfilePicture";
import { jwtDecode } from "jwt-decode";


export const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
                if (token) {    
                try {
                const decoded = jwtDecode(token);
                const userId = decoded.nameid;
                
                getUserById(token, userId)
                    .then((data) => {
                        setUser(data.user);
                        localStorage.setItem("token", data.token);
                    })
                    .catch((err) => {
                        console.error(err);
                        navigate("/login");
                    });
            } catch (err) {
                console.error("Invalid token", err);
                navigate("/login");
            }
            } else {
                navigate("/login");
            }
        }, [navigate]);
     
    return (
        <>
        {user && <Username username={user.username} key={user._id}/>}
        {user && <ProfilePicture profilePicture={user.profilePicture} key={user._id}/>}
        </>
    )
}
