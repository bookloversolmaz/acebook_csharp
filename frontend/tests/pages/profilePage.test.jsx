import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

import { ProfilePage } from "../../src/pages/Profile/ProfilePage";
import { getUserById } from "../../src/services/users";
// import { useNavigate } from "react-router-dom";
import jwt from 'jsonwebtoken';

// Mocking the getUserById service
vi.mock("../../src/services/users", () => {
    const getUserByIdMock = vi.fn();
    return { getUserById : getUserByIdMock };
});

// Mocking React Router's useNavigate function
const navigateMock = vi.fn();

vi.mock("react-router-dom", async () => {
    const useNavigateMock = () => navigateMock; // Create a mock function for useNavigate
    return { useNavigate: useNavigateMock };
});


const generateTestToken1 = (payload = { userId: '123', role: 'admin' }) => {
    const secret = 'test-secret';
    const token = jwt.sign(payload, secret, { expiresIn: '1h' });
    return token;

};
const generateTestToken2 = (payload = { userId: '1234', role: 'admin2' }) => {
    const secret = 'test-secret2';
    const token = jwt.sign(payload, secret, { expiresIn: '1s' });
    return token;
};

describe("Profile Page", () => {
    beforeEach(() => {
        window.localStorage.removeItem("token");
    });

    test("It displays username from the backend", async () => {
        const token = generateTestToken1();
        console.log(`username token is ${token}`)
        window.localStorage.setItem("token", token);
    
        const mockUser = { _id: "123", username: "admin", profilepicture :"Profile_Image_Default.png" };
    
        getUserById.mockResolvedValue({ user: mockUser, token: token });
    
        render(<ProfilePage />);
        screen.debug(); 
        const usernameElement = await screen.findByRole("heading", {level: 3});
        expect(usernameElement.textContent).toBe("admin");

    });

        test("It displays profile picture from the backend", async () => {
        const token2 = generateTestToken2();
        console.log(`profilepicture token is ${token2}`)
        window.localStorage.setItem("token", token2);
    
        const mockUser = { _id: "1234", username: "admin2", profilepicture : "../assets/Profile_Image_Default.png" };
    
        getUserById.mockResolvedValue({ user: mockUser, token: token2 });
    
        render(<ProfilePage />);
        
        const image = await screen.findByRole("img");
        expect(image).toBeInstanceOf(HTMLImageElement);

        expect(image.src).toBe("http://localhost:3000/assets/Profile_Image_Default.png");

    });

    test("It navigates to login if no token is present", async () => {
        render(<ProfilePage />);
        expect(navigateMock).toHaveBeenCalledWith("/login"); 
    });

});