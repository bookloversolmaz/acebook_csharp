import { render, screen, within } from "@testing-library/react";
import { describe, expect, vi, beforeEach } from 'vitest';
import Post from "../../src/components/Post/Post";
import { getUserById} from "../../src/services/users";
import jwt from 'jsonwebtoken';


// Setup mock for getUserById Service
vi.mock("../../src/services/users", () => {
    const getUserByIdMock = vi.fn();
    return { getUserById : getUserByIdMock };
});

const generateTestToken = (payload = { userId: '123', role: 'admin' }) => {
    const secret = 'test-secret';
    const token = jwt.sign(payload, secret, { expiresIn: '1h' });
    return token;
};

describe("Post component", () => {
  beforeEach(() => {
    vi.resetAllMocks();
        //Setup the mock return value
      getUserById.mockResolvedValue({
      user: {
        username: "testuser",
        profilePicture: "https://storage.googleapis.com/liberis_training/Profile_Image_Default.png"
      }
  });
});
   test("displays the message as an article", () => {
    const testPost = { _id: "123", message: "test message", userId: "23", createdAt: "2025-05-19T13:18:54.651074Z" };
    const token = generateTestToken();
    render(<Post post={testPost} token={token} />);

    const post = screen.getByRole("article");
    const message = within(post).getByTestId("post-message")
    expect(message.textContent).toBe("test message");
  });

  test("displays the username within the article", async () => {
    const testPost = { _id: "123", message: "test message", userId: "23", createdAt: "2025-05-19T13:18:54.651074Z" };
    const token = generateTestToken();
    render(<Post post={testPost} token={token}/>);

    const post = await screen.findByRole("article");
    const username = within(post).getByTestId("post-username")
    expect(username.textContent).toEqual("testuser");
    });

  test("displays the createdAt date and time within the article", async () => {
    const testPost = { _id: "123", message: "test message", userId: "23", createdAt: "2025-05-19T13:18:54.651074Z" };
    const token = generateTestToken();
    render(<Post post={testPost} token={token}/>);

    const post = await screen.findByRole("article");
    const createdAt = within(post).getByTestId("post-createdAt")
    expect(createdAt.textContent).toEqual("19/05/25 14:18");
    });

    test("displays the profile picture", async () => {
    const testPost = { _id: "123", message: "test message", userId: "23", createdAt: "2025-05-19T13:19:54.651074Z" };
  
  
    const token = generateTestToken();
    render(<Post post={testPost} token={token}/>);

    const image = await screen.findByRole("img");
    expect(image.src).toBe("https://storage.googleapis.com/liberis_training/Profile_Image_Default.png");

  });
});

  



 
  