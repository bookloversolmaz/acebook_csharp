import { vi, assert } from "vitest";
import jwt from 'jsonwebtoken';
import { getUserById} from "../../src/services/users";
import { render, screen, waitFor, within} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FeedPage } from "../../src/pages/Feed/FeedPage"; // Component being tested, displays the feed post
import {getPosts, createPost } from "../../src/services/posts"; // import WHOLE module. Service function responsible for fetching posts from the backend
import { useNavigate } from "react-router-dom"; // Hook from react router dom for programmatic navigation within app
import { getCommentsByPostId } from "../../src/services/comments";
// import { createComment } from "../../src/services/comments";


// Mocking the getPosts and createpost service, which get and creates posts from the backend
// Tells vitest to replace getsPosts function with the mock getPostsMock. mocks useEffect
vi.mock("../../src/services/posts", () => {
  const getPostsMock = vi.fn(); // vi.fn() is a method for creating a mock function to track calls and define return values
  const createPostMock = vi.fn();
  return { getPosts: getPostsMock, createPost: createPostMock };})

vi.mock("../../src/services/comments", () => {
  const getCommentsByPostIdMock = vi.fn();
  const createCommentMock = vi.fn();
  return { getCommentsByPostId: getCommentsByPostIdMock, createComment: createCommentMock };})
  
vi.mock("../../src/components/Comments/CreateCommentForm", () => {
  return {
    default: ({ onCommentCreated }) => (
      <button onClick={() => onCommentCreated({ _id: "c3", message: "New Comment" })}>Comment</button>
  )
  }})

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

  beforeEach(() => { // Runs before each test, ensuring that the local storage token is cleared before each test runs to avoid state pollution.
    window.localStorage.removeItem("token");
    vi.resetAllMocks();
  });

  // This test checks whether the posts fetched from the backend are displayed correctly in the FeedPage.
  test("It displays posts from the backend", async () => {

    const token = generateTestToken();
    window.localStorage.setItem("token", token);

    const mockPosts = [{ _id: "12345", message: "Test Post 1", userId: "123" }];

    getPosts.mockResolvedValue({ posts: mockPosts, token: "newToken" });
    getUserById.mockResolvedValue({user: {username: "TestUserRuss"}});

    render(<FeedPage />);

    const post = await screen.findByTestId("post-article");
    const message = await within(post).findByTestId("post-message")
    expect(message.textContent).toEqual("Test Post 1");
  });

  test("Feed Page displays username of the poster with each post", async () => {
    const token = generateTestToken();
    window.localStorage.setItem("token", token);

    const mockPosts = [{ _id: "12345", message: "Test Post 1", userId: "123" }];

    getPosts.mockResolvedValue({ posts: mockPosts, token: "newToken" });
    getUserById.mockResolvedValue({user: {username: "admin"}});

    render(<FeedPage />);

    const post = await screen.findByTestId("post-article");
    const username = await within(post).findByTestId("post-username");
    expect(username.textContent).toEqual("admin");

  });

  test("Feed Page displays createdAt Date and Time with each post", async () => {
    const token = generateTestToken();
    window.localStorage.setItem("token", token);

    const mockPosts = [{ _id: "12345", message: "Test Post 1", userId: "123", createdAt: "2025-05-19T13:18:54.651074Z" }];

    getPosts.mockResolvedValue({ posts: mockPosts, token: "newToken" });
    getUserById.mockResolvedValue({user: {username: "TestUserRuss"}});

    render(<FeedPage />);

    const post = await screen.findByRole("article");
    const username = within(post).getByTestId("post-createdAt")
    expect(username.textContent).toEqual("19/05/25 14:18");

  });

  //  Navigating the login, if no token is present redirect to login page
  test("It navigates to login if no token is present", async () => {
    render(<FeedPage />); // rendered without setting a token, simulating an unauthenticated user.
    // The test then checks if the navigateMock function was called with the /login route, confirming that the redirection logic works correctly.
    const navigateMock = useNavigate();
    expect(navigateMock).toHaveBeenCalledWith("/login");
  });

  // Check that user can post and display posts
  test("Can add a new post to the feed page", async () => {
    // ARRANGE
    // Use userEvent rather than fireevent, which simulates full interactions rather than dispatching dom events
    // userEvent simulates real user interactions, such as typing, clicking etc
    const user = userEvent.setup() // must invoke userEvent before component is rendered
    // simulate user login with the test token first
    window.localStorage.setItem("token", "testToken");
    // tells createpost from vi.mock to resolve with the given post when its called
    // When `FeedPage` is rendered, it will eventually call `createPost` after the form is submitted.
    // You must define how the mock should behave *before* it's called — otherwise, the mock might return `undefined`, reject unexpectedly, or just not behave as expected.
    // Think of this as setting up the backend’s behaviour before the app interacts with it.
    const mockPosts = [{ _id: "123456", message: "Test Post 2" }]; 
    getPosts.mockResolvedValue({ posts: mockPosts, token: "testToken" }); 
    createPost.mockResolvedValue({post: {_id: "1", Message: "test post", }, });
    // Then renders page 
    render(<FeedPage />);
    // ACT
    // Simulate user typing in the input and submitting the form
    // Selects the text input by its label "Message:"
    const input = screen.getByLabelText(/message/i);
    await user.type(input, "test post");
    const submitButton = screen.getByTestId("post-submit", { name: /submit/i });
    await user.click(submitButton);
    // ASSERT
    // createPost was called with correct arguments (token and message)
    await waitFor(() => {
      expect(createPost).toHaveBeenCalledWith("testToken", "test post");
    });
  });
  // fetch post from backend, add a new post using createpost and check that the newest post is at the top of the page
  test("Displays existing posts and new posts from create post correctly, with the newest post first", async () => {
      // ARRANGE
      const user = userEvent.setup(); // Used to mimic user creating a new post and then re-rendering the page
      // Set token in localStorage
      window.localStorage.setItem("token", "testToken");
      // Set up initial posts from backend
      const initialPosts = [{ _id: "1", message: "Old Post" }];
      getPosts.mockResolvedValue({ posts: initialPosts, token: "testToken" });
      // ACT: Simulate creating a new post
      // First render - should show initial post
      render(<FeedPage />);
      await screen.findByText("Old Post");
      // Mock createPost response (newer post)
      createPost.mockResolvedValue({post: { _id: "2", message: "New Post" },});
      await user.type(screen.getByLabelText(/message:/i), "New Post");
      await user.click(screen.getByTestId("post-submit", { name: /submit/i }));
      // ASSERT: After submission, both posts should be in the feed
      const postsAfterCreate = await screen.findAllByRole("article");
      expect(postsAfterCreate).toHaveLength(2);
      expect(postsAfterCreate[0].textContent).toContain("New Post");
      expect(postsAfterCreate[1].textContent).toContain("Old Post");
  });
  // re-render the component. check that the newest post is at the top of the list.
  test("Does the page list the posts in order from newest to oldest after re-rendering", async () =>{
      // ARRANGE
      // const user = userEvent.setup(); 
      window.localStorage.setItem("token", "testToken");
      getPosts.mockResolvedValue({
        posts: [ 
        { _id: "2", message: "New Post" }, // newer post first
        { _id: "1", message: "Old Post" },
        ], });

      // ACT
      render(<FeedPage />);
      // Wait for feed to be present
      const feed = await screen.findByRole("feed");

      // Get all posts (articles) inside the feed. The role is article, which is ARIA role for scrollable container of dynamic content
      const articles = within(feed).getAllByRole("article");

      // ASSERT
      expect(articles).toHaveLength(2);
      expect(articles[0].textContent).toContain("New Post");
      expect(articles[1].textContent).toContain("Old Post");
      });


  // eslint-disable-next-line vitest/expect-expect
  test("displays comments under posts", async () => {
    window.localStorage.setItem("token", "testToken");

    getPosts.mockResolvedValue({
      posts: [{ _id: "1", message: "Post with comments", userId: "u1" }],
      token: "testToken"
    });

    getCommentsByPostId.mockResolvedValue({
      comments: [
        { _id: "c1", message: "First Comment" },
        { _id: "c2", message: "Second Comment" }
      ]
  });

    render(<FeedPage />);

    const post = await screen.findByText("Post with comments"); // finds the post we added in the mock resolved value
    const article = post.closest("article"); // locates the article containing the post - avoids other articles (posts) being selected

    // Assert that the comment text is present within the selected article
    assert.exists(within(article).queryByText("First Comment"));
    assert.exists(within(article).queryByText("Second Comment"));
});


  test("displays comments with newest first", async () => {
    window.localStorage.setItem("token", "testToken");
    
    getPosts.mockResolvedValue({
      posts: [{ _id: "1", message: "Post with comments", userId: "u1" }],
      token: "testToken"
    });

    getCommentsByPostId.mockResolvedValue({
      comments: [
        { _id: "c2", message: "Second Comment" },
        { _id: "c1", message: "First Comment" },
      ]
    })

    render(<FeedPage />);
    const post = await screen.findByText("Post with comments"); // finds the post we added in the mock resolved value
    const article = post.closest("article"); // locates the article containing the post - avoids other articles (posts) being selected
    const commentElements = await within(article).findAllByTestId("comment-message");

    expect(commentElements[0].textContent).toEqual("Second Comment");
    expect(commentElements[1].textContent).toEqual("First Comment");
  });

  test("adds new comment to the top", async () => {
    window.localStorage.setItem("token", "testToken");

    getPosts.mockResolvedValue({
      posts: [{ _id: "1", message: "Post with comment", userId: "u1" }],
      token: "testToken"
    });

    getCommentsByPostId.mockResolvedValue({
      comments: [
        { _id: "c1", message: "Old Comment" }
      ]
    });

    render(<FeedPage />);

    const post = await screen.findByText("Post with comment"); // finds the post we added in the mock resolved value
    const article = post.closest("article"); // locates the article containing the post - avoids other articles (posts) being selected

    // Click to trigger new comment addition and rendering
    screen.getByText("Comment").click();

    await waitFor(() => {
      const commentElements = within(article).getAllByTestId("comment-message");

      expect(commentElements[0].textContent).toEqual("New Comment");
      expect(commentElements[1].textContent).toEqual("Old Comment");  
    })
    

  })
});