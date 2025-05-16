import { render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";

import { ProfilePage } from "../../src/pages/Profile/ProfilePage";
import { getUserById } from "../../src/services/users";
// import { useNavigate } from "react-router-dom";

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

describe("Profile Page", () => {
    beforeEach(() => {
        window.localStorage.removeItem("token");
    });

    test("It displays username from the backend", async () => {
        window.localStorage.setItem("token", "testToken");
    
        const mockUser = { _id: "12345", username: "user14" };
    
        getUserById.mockResolvedValue({ user: mockUser, token: "newToken" });
    
        render(<ProfilePage />);
        
        await waitFor(() =>{
        const username = screen.getByRole("heading", { level: 3 });
        expect(username.textContent).toBe("user14"); 
        })

    });

    test("It navigates to login if no token is present", async () => {
        render(<ProfilePage />);
        expect(navigateMock).toHaveBeenCalledWith("/login"); 
    });

});