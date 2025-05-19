import { render, screen, within } from "@testing-library/react";
import { vi } from "vitest";
import jwt from 'jsonwebtoken';
import { FeedPage } from "../../src/pages/Feed/FeedPage";
import { getPosts } from "../../src/services/posts";
import { useNavigate } from "react-router-dom";
import { getUserById} from "../../src/services/users";

// Mocking the getPosts service
vi.mock("../../src/services/posts", () => {
  const getPostsMock = vi.fn();
  return { getPosts: getPostsMock };
});

// Mocking getUserById service
vi.mock("../../src/services/users", () => {
    const getUserByIdMock = vi.fn();
    return { getUserById : getUserByIdMock };
});

// Mocking React Router's useNavigate function
vi.mock("react-router-dom", () => {
  const navigateMock = vi.fn();
  const useNavigateMock = () => navigateMock; // Create a mock function for useNavigate
  return { useNavigate: useNavigateMock };
});

const generateTestToken = (payload = { userId: '123', role: 'admin' }) => {
    const secret = 'test-secret';
    const token = jwt.sign(payload, secret, { expiresIn: '1h' });
    return token;
};

describe("Feed Page", () => {
  beforeEach(() => {
    window.localStorage.removeItem("token");
    vi.resetAllMocks();
  });

  test("It displays posts from the backend", async () => {
    const token = generateTestToken();
    window.localStorage.setItem("token", token);

    const mockPosts = [{ _id: "12345", message: "Test Post 1", userId: "123" }];

    getPosts.mockResolvedValue({ posts: mockPosts, token: "newToken" });
    getUserById.mockResolvedValue({user: {username: "TestUserRuss"}});

    render(<FeedPage />);

    const post = await screen.findByRole("article");
    const message = within(post).getByTestId("post-message")
    expect(message.textContent).toEqual("Test Post 1");
  });

  test("Feed Page displays username of the poster with each post", async () => {
    const token = generateTestToken();
    window.localStorage.setItem("token", token);

    const mockPosts = [{ _id: "12345", message: "Test Post 1", userId: "123" }];

    getPosts.mockResolvedValue({ posts: mockPosts, token: "newToken" });
    getUserById.mockResolvedValue({user: {username: "TestUserRuss"}});

    render(<FeedPage />);

    const post = await screen.findByRole("article");
    const username = within(post).getByTestId("post-username")
    expect(username.textContent).toEqual("TestUserRuss");
  });

  test("Feed Page displays createdAt Date with each post", async () => {
    const token = generateTestToken();
    window.localStorage.setItem("token", token);

    const mockPosts = [{ _id: "12345", message: "Test Post 1", userId: "123", createdAt: "2025-05-19T13:18:54.651074Z" }];

    getPosts.mockResolvedValue({ posts: mockPosts, token: "newToken" });
    getUserById.mockResolvedValue({user: {username: "TestUserRuss"}});

    render(<FeedPage />);

    const post = await screen.findByRole("article");
    const username = within(post).getByTestId("post-createdAt")
    expect(username.textContent).toEqual("19/05/25");
  });

  test("It navigates to login if no token is present", async () => {
    render(<FeedPage />);
    const navigateMock = useNavigate();
    expect(navigateMock).toHaveBeenCalledWith("/login");
  });
});
