import { render, screen, within } from "@testing-library/react";
import { describe, expect, vi, beforeEach } from 'vitest';
import { getUserById} from "../../src/services/users";
import jwt from 'jsonwebtoken';
import IndividualCommentDisplay from "../../src/components/Comments/IndividualCommentDisplay";

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

describe("IndividualCommentDisplay component", () => {
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
    test("displays the comment as an article", () => {
        const testComment = { _id: "123", message: "test comment", userId: "23", postId: "2", createdAt: "2025-05-19T13:18:54.651074Z" };
        const token = generateTestToken();
        render(<IndividualCommentDisplay comment={testComment} token={token} />);

        const comment = screen.getByRole("article");
        const message = within(comment).getByTestId("comment-message")
        expect(message.textContent).toBe("test comment");
    });

    test("displays the username within the comment article", async () => {
        const testComment = { _id: "123", message: "test comment", userId: "23", postId: "2", createdAt: "2025-05-19T13:18:54.651074Z" };
        const token = generateTestToken();
        render(<IndividualCommentDisplay comment={testComment} token={token}/>);

        const comment = await screen.findByRole("article");
        const username = within(comment).getByTestId("comment-username")
        expect(username.textContent).toEqual("testuser");
        });

    test("displays the createdAt date and time within the comment article", async () => {
        const testComment = { _id: "123", message: "test comment", userId: "23", postId: "2", createdAt: "2025-05-19T13:18:54.651074Z" };
        const token = generateTestToken();
        render(<IndividualCommentDisplay comment={testComment} token={token}/>);

        const comment = await screen.findByRole("article");
        const createdAt = within(comment).getByTestId("comment-createdAt")
        expect(createdAt.textContent).toEqual("19/05/25 14:18");
        });

    test("displays the profile picture", async () => {
        const testComment = { _id: "123", message: "test comment", userId: "23", postId: "2", createdAt: "2025-05-19T13:18:54.651074Z" };
        const token = generateTestToken();
        render(<IndividualCommentDisplay comment={testComment} token={token}/>);

        const image = await screen.findByRole("img");
        expect(image.src).toBe("https://storage.googleapis.com/liberis_training/Profile_Image_Default.png");

    });
    });

    



    
    