import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { ProfilePage } from "../../src/pages/Profile/ProfilePage";

import { useNavigate } from "react-router-dom";

// // Mocking the getPosts service
// vi.mock("../../src/services/posts", () => {
//   const getPostsMock = vi.fn();
//   return { getPosts: getPostsMock };
// });

// Mocking React Router's useNavigate function
vi.mock("react-router-dom", () => {
  const navigateMock = vi.fn();
  const useNavigateMock = () => navigateMock; // Create a mock function for useNavigate
  return { useNavigate: useNavigateMock };
});

describe("Profile Page", () => {
  beforeEach(() => {
    window.localStorage.removeItem("token");
  });
  
  test("It navigates to login if no token is present", async () => {
    render(<ProfilePage />);
    const navigateMock = useNavigate();
    expect(navigateMock).toHaveBeenCalledWith("/login");
  });

  //  test("It displays username from the backend", async () => {
  //   window.localStorage.setItem("token", "testToken");

  //   const mockUser = [{ _id: "12345", username: "Test User 1" }];

  //   getUser.mockResolvedValue({ username: mockUser, token: "newToken" });

  //   render(<ProfilePage />);

  //   const username = await screen.findByRole("article");
  //   expect(username.textContent).toEqual("Test Post 1");
  // });

  
});
