import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./App.css";
import { HomePage } from "./pages/Home/HomePage";
import { LoginPage } from "./pages/Login/LoginPage";
import { SignupPage } from "./pages/Signup/SignupPage";
import { FeedPage } from "./pages/Feed/FeedPage";
import { ProfilePage } from "./pages/Profile/ProfilePage";
// import { Navbar } from "./components/Navbar";
import { RootLayout } from "./components/RootLayout";

// docs: https://reactrouter.com/en/main/start/overview
const router = createBrowserRouter([
  {
    path:"/",
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage />},
      { path: "login", element: <LoginPage />},
      { path: "signup", element: <SignupPage />},
      { path: "posts", element: <FeedPage />},
      { path: "profile", element: <ProfilePage />}
    ]
  }
]);

const App = () => {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default App;
