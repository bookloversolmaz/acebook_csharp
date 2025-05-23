import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { signup } from "../../services/authentication";
import { checkUsername } from "../../services/authentication";
import { checkEmail } from "../../services/authentication";

export const SignupPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const passValidator = (string) => {
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
    const numberRegex = /[0-9]/;
    return (
      specialCharRegex.test(string) &&
      numberRegex.test(string)
    );
  };

    const emailValidator = (string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return (
      emailRegex.test(string)
    );
  };
  
  async function CheckUsernameExists (username){
    try{
      const response = await checkUsername(username)
      //if response is true - username exists so return signup page and alert
      if(response == true){
        return false
      }else{
        return true
      }
    }catch(err){
      console.error(err);
    }
  }

    async function CheckEmailExists(email){
    try{
      const response = await checkEmail(email)
      //if response is true - username exists so return signup page and alert
      if(response == true){
        return false
      }else{
        return true
      }
    }catch(err){
      console.error(err);
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const usernameExists = await CheckUsernameExists(username);
    const emailExists = await CheckEmailExists(email);
    if (password.length >= 8 && passValidator(password) && emailValidator(email)){
          if(usernameExists){
                if(emailExists) {
                  try {
                    await signup(username, email, password);
                    console.log("redirecting...:");
                    console.log("SIGNUP success, navigating to login");
                    navigate("/login");
                } catch (err) {
                  console.error(err);
                  navigate("/signup");
                  }
                }
                else {
                  alert("Email already exists. Please choose another email.");
                  navigate("/signup");
                }
          } else {
              alert("Username already exists. Please choose another username.");
              navigate("/signup");
          }
    } else{
        alert("Your password or email is not valid. Passwords must have one number, one special character and atleast 8 characters long");
        navigate("/signup");
    }
  }
  

  const handleUsernameChange = (event)=> {
    setUsername(event.target.value)
  };
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  return (
    <>
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username:</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={handleUsernameChange}
        />
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="text"
          value={email}
          onChange={handleEmailChange}
        />
        <label htmlFor="password">Password:</label>
        <input
          placeholder="Password"
          id="password"
          type="password"
          value={password}
          onChange={handlePasswordChange}
        />
        <button role="submit-button" id="submit" type="submit" value="Submit">Submit</button>
      </form>
    </>
  );
};
