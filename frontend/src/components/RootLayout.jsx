// src/components/RootLayout.jsx
import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";

export const RootLayout = () => {
    return (
        <>
        <Navbar />
        <main className="container mt-4">
            <Outlet />
        </main>
        </>
    );
};
