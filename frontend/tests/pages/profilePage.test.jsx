import { render, screen, waitFor } from "@testing-library/react";
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

const generateTestToken = (payload = { userId: '123', role: 'admin' }) => {
  const secret = 'test-secret';
  const token = jwt.sign(payload, secret, { expiresIn: '1h' });
  return token;
};

describe("Profile Page", () => {
    beforeEach(() => {
        window.localStorage.removeItem("token");
    });

    test("It displays username from the backend", async () => {
        const token = generateTestToken();
        
        window.localStorage.setItem("token", token);
    
        const mockUser = { _id: "123", username: "admin" };
    
        getUserById.mockResolvedValue({ user: mockUser, token: token });
    
        render(<ProfilePage />);
        screen.debug(); 

        // await waitFor(() =>{
        // const username = await screen.getByText(mockUser.username);
        // expect(username.textContent).toBe("admin"); 
        // expect(screen.getByText(mockUser.username)).toBeInTheDocument;
        // console.log(`username is ${mockUser.username}`)
        // const usernameElement = await screen.findByText(mockUser.username);
        
        // expect(usernameElement).toBeInTheDocument();
        // // })
        const usernameElement = await screen.findByRole("heading", {level: 3});
        expect(usernameElement.textContent).toBe("admin");

    });

    test("It navigates to login if no token is present", async () => {
        render(<ProfilePage />);
        expect(navigateMock).toHaveBeenCalledWith("/login"); 
    });

});