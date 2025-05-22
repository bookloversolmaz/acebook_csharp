import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

import { ProfilePage } from "../../src/pages/Profile/ProfilePage";
import { getUserById,  } from "../../src/services/users";
import { getPosts } from "../../src/services/posts";

// import { useNavigate } from "react-router-dom";
import jwt from 'jsonwebtoken';

// Mocking the getUserById service
vi.mock("../../src/services/users", () => {
    const getUserByIdMock = vi.fn();
    return { getUserById : getUserByIdMock,  };
});

vi.mock("../../src/services/posts", () => {
    const getPostsMock = vi.fn();
    return { getPosts : getPostsMock };
});

// Mocking React Router's useNavigate function
const navigateMock = vi.fn();

vi.mock("react-router-dom", async () => {
    const useNavigateMock = () => navigateMock; // Create a mock function for useNavigate
    return { useNavigate: useNavigateMock };
});


const generateTestToken1 = (payload = { nameid: '1235', role: 'admin' }) => {
    const secret = 'test-secret';
    const token = jwt.sign(payload, secret, { expiresIn: '1h' });
    return token;

};
const generateTestToken2 = (payload = { nameid: '1234', role: 'admin' }) => {
    const secret = 'test-secret2';
    const token = jwt.sign(payload, secret, { expiresIn: '1s' });
    return token;
};
const generateTestToken3 = (payload = { nameid: '1236', role: 'admin' }) => {
    const secret = 'test-secret3';
    const token = jwt.sign(payload, secret, { expiresIn: '1s' });
    return token;
};

const generateTestToken4 = (payload = { userId: '123', role: 'admin' }) => {
    const secret = 'test-secret4';
    const token = jwt.sign(payload, secret, { expiresIn: '1s' });
    return token;
};

describe("Profile Page", () => {
    beforeEach(() => {
        window.localStorage.removeItem("token");
        vi.clearAllMocks();
    });

    test("It displays username from the backend", async () => {
        const token = generateTestToken1();
        window.localStorage.setItem("token", token);
        const mockUser = { _id: "1235", username: "admin" };
    
        getUserById.mockResolvedValue({ user: mockUser, token: token });

        render(<ProfilePage />);

        const usernameElement = await screen.findByRole("heading", {level: 3});
        expect(usernameElement.textContent).toBe("admin");

    });

        test("It displays profile picture from the backend", async () => {
        const token2 = generateTestToken2();
  
        window.localStorage.setItem("token", token2);
    
        const mockUser = { _id: "1234", username: "admin2", profilePicture : "https://storage.googleapis.com/liberis_training/Profile_Image_Default.png" };
    
        getUserById.mockResolvedValue({ user: mockUser, token: token2 });

        render(<ProfilePage />);
        
        const image = await screen.findByRole("img");
        expect(image).toBeInstanceOf(HTMLImageElement);

        expect(image.src).toBe("https://storage.googleapis.com/liberis_training/Profile_Image_Default.png");

    });
    test("It displays create post form", async () => {
        const token3 = generateTestToken3();

        window.localStorage.setItem("token", token3);
    
        const mockUser = { _id: "1236", username: "admin3", profilePicture : "https://storage.googleapis.com/liberis_training/Profile_Image_Default.png" };
    
        getUserById.mockResolvedValue({ user: mockUser, token: token3 });

        render(<ProfilePage />);
        
        const heading = await screen.findByRole("heading", {level: 2})

        expect(heading.textContent).toContain("Create new post");

    });
    

    test("It displays the users posts from the backend to the profile page", async () => {

    const token4 = generateTestToken4();
    window.localStorage.setItem("token", token4);

    const mockPosts = [
        { _id: "12345", message: "Test Post 1", createdAt: "2025-05-18T13:20:54.651074Z", userId: "123"},
        { _id: "12346", message: "Test Post 2", createdAt: "2025-05-19T13:18:54.651074Z", userId: "123" },
        { _id: "12347", message: "Test Post 3", createdAt: "2025-05-19T13:18:54.651074Z", userId: "1230" }
    ];

    
    getUserById.mockResolvedValue({
        user: { _id: "123", username: "admin4", token: token4,profilePicture : "https://storage.googleapis.com/liberis_training/Profile_Image_Default.png"},
    });
    getPosts.mockResolvedValue({ posts: mockPosts, token: token4 });
    render(<ProfilePage />);

    
    const message = await screen.findAllByTestId("post-message");
    expect(message).toHaveLength(2);
    expect(message[0].textContent).toBe("Test Post 1");
    expect(message[1].textContent).toBe("Test Post 2");
    expect(navigateMock).not.toHaveBeenCalled(); 
    });

    test("It navigates to login if no token is present", async () => {
        render(<ProfilePage />);
        expect(navigateMock).toHaveBeenCalledWith("/login"); 
    });

});