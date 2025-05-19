import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserById } from "../../services/users";
import Username from "../../components/UserDetails/Username";

import { jwtDecode } from "jwt-decode";


export const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        // if (!token) {
        //     navigate("/login");
        //     return;
        // }
        //     try {
        //         const decoded = jwtDecode(token);
        //         console.log("This is the decoded value ===v")
        //         console.log(decoded)
        //         const userId = decoded.nameid || decoded.sub || decoded.userId;
                

        //         if (!userId) {
        //             console.error("User ID not found in token");
        //             navigate("/login");
        //             return;
        //         }
        //         // THIS IS WRONG. NEEDS FIXING ==v
        //         // const userId = 2;
                
        //         getUserById(token, userId)
        //             .then((data) => {
                    
        //             console.log("ProfilePage.jsx data.user ==v");
        //             console.log(data.user);
        //             setUser(data.user);
        //             localStorage.setItem("token", data.token);
        //             })
        //             .catch((err) => {
        //             console.error("Error fetching users", err);
        //             navigate("/login");
        //             });
        //     } catch (err) {
        //         console.error("Invalid token", err);
        //         navigate("/login");
        //     }
        // }, [navigate]);
                if (token) {    
                try {
                const decoded = jwtDecode(token);
                // console.log("This is the decoded value ===v")
                console.log(decoded)
                const userId = decoded.nameid;

                // THIS IS WRONG. NEEDS FIXING ==v
                // const userId = 2;
                
                getUserById(token, userId)
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
        </>
    )
}