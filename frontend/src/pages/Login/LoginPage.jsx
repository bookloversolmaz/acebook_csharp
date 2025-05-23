import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { login, checkEmail } from "../../services/authentication";

export const LoginPage = () => {
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
   async function CheckEmailExists(email){
      try{
        const response = await checkEmail(email)
     
           return response;
      }catch(err){
        console.error(err);
      }
    }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const emailExists = await CheckEmailExists(email);
    if (password.length >= 8 && passValidator(password) && emailValidator(email)){

      if(emailExists == false){

        alert("This email has not been registered. Please sign up first.")
        navigate("/login");
      }else{
        try {
        const token = await login(email, password);
        localStorage.setItem("token", token);
        navigate("/posts");
      } catch (err) {
        console.error(err);
        navigate("/login");
      }
      }
    }else{
        alert("Your email or password is incorrect. Please provide correct information.")
        navigate("/login");
    }  
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  return (
    <>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="text"
          value={email}
          onChange={handleEmailChange}
        />
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={handlePasswordChange}
        />
        <input role="submit-button" id="submit" type="submit" value="Submit" />
      </form>
    </>
  );
};
