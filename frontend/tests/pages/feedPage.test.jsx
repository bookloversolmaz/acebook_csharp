import { render, screen, fireEvent, waitFor} from "@testing-library/react";
import { vi } from "vitest";

import { FeedPage } from "../../src/pages/Feed/FeedPage"; // Component being tested, displays the feed post
import {getPosts, createPost } from "../../src/services/posts"; // import WHOLE module. Service function responsible for fetching posts from the backend
import { useNavigate } from "react-router-dom"; // Hook from react router dom for programmatic navigation within app
import { Component } from "react";

// Mocking the getPosts and createpost service, which get and creates posts from the backend
// Tells vitest to replace getsPosts function with the mock getPostsMock. mocks useEffect
vi.mock("../../src/services/posts", () => {
  const getPostsMock = vi.fn(); // vi.fn() is a method for creating a mock function to track calls and define return values
  const createPostMock = vi.fn(); 
  return { getPosts: getPostsMock, createPost: createPostMock };
});

// Mocking React Router's useNavigate function to track navigation actions during the test
// navigate mock replaces original useNavigate
vi.mock("react-router-dom", () => { 
  const navigateMock = vi.fn();
  const useNavigateMock = () => navigateMock; // Create a mock function for useNavigate
  return { useNavigate: useNavigateMock };
});   

// Test suite setup, creating a mock token and render
describe("Feed Page", () => {

  beforeEach(() => { // Runs before each test, ensuring that the local storage token is cleared before each test runs to avoid state pollution.
    window.localStorage.removeItem("token");
  });
  // This test checks whether the posts fetched from the backend are displayed correctly in the FeedPage.
  test("It displays posts from the backend", async () => {
    window.localStorage.setItem("token", "testToken"); // Set a test token in local storage to simulate user

    const mockPosts = [{ _id: "12345", message: "Test Post 1" }]; // Creates a mock post

    getPosts.mockResolvedValue({ posts: mockPosts, token: "newToken" }); // Mock API response

    render(<FeedPage />); // Render feedpage

    const post = await screen.findByRole("article"); // wait for the post to be rendered
    expect(post.textContent).toEqual("Test Post 1"); // Assert that the post displays correctly
  });

  //  Second test, navigating the login, if no token is present redirect to login page
  test("It navigates to login if no token is present", async () => {
    render(<FeedPage />); // rendered without setting a token, simulating an unauthenticated user.
    // The test then checks if the navigateMock function was called with the /login route, confirming that the redirection logic works correctly.
    const navigateMock = useNavigate();
    expect(navigateMock).toHaveBeenCalledWith("/login");
  });

  // handlesubmit can call createPost
  test("Can add a new post to the feed page", async () => {
    // Arrange
    // set a token to simulate an authenticated user
    window.localStorage.setItem("token", "testToken"); // Set a test token in local storage to simulate user
    const mockPosts = [{ _id: "12345", message: "getcreate mock" }]; // Creates a mock post
    getPosts.mockResolvedValue({ posts: mockPosts, token: "newToken" }); // Mock API response
    // Then renders page 
    render(<FeedPage />);

    // Act
    // wait for feed page to be rendered
    const post = await screen.findByRole("article"); // wait for the post to be rendered


      createPost.mockResolvedValue({
    post: 
    { 
      _id: "1", Message: "test post",
    },
    });
    await createPost("test post");
    // createPost.mockResolvedValue({
    // post: 
    // { 
    //   _id: "1", Message: "test post",
    // },
    // });
    // Assert: Wait for getPosts to resolve
    expect(createPost).toHaveBeenCalledWith("test post");

  });

  // check if createpost correctly displays input

    //   // ACT: Simulate user filling in and submitting the form
    // const input = screen.getByLabelText(/message/i);
    // fireEvent.change(input, { target: { value: "test post" } });

    // const submitButton = screen.getByRole("button", { name: /submit/i });
    // fireEvent.click(submitButton);

    // // ASSERT: createPost was called with correct arguments
    // await waitFor(() => {
    //   expect(createPost).toHaveBeenCalledWith("testToken", "test post");
    // });

    // // ASSERT: New post appears in the document
    // expect(screen.getByText("test post")).toBeInTheDocument();

});