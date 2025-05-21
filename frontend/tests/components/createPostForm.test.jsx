import { render, screen, fireEvent } from "@testing-library/react";
import CreatePostForm from "../../src/components/Post/CreatePostForm";
import { vi } from "vitest";
import { createPost } from "../../src/services/posts";


// const createPostMock: vi.fn();
// // // Mock the createPost function VERSION 1
// vi.mock("../../../src/services/posts", () => ({
//     createPost : createPostMock
// }));

// Mock the createPost function VERSION 2
vi.mock("../../src/services/posts", () => ({
    createPost: vi.fn()
}));

describe("CreatePostForm", () => {
    const mockToken = "mock-token";

    test("calls createPost and onPostCreated on form submit", async () => {
        const mockPost = { _id: "123", message: "Hello world" };
        createPost.mockResolvedValueOnce({ post: mockPost });

        const mockOnPostCreated = vi.fn();

        render(<CreatePostForm token={mockToken} onPostCreated={mockOnPostCreated} />)

        const input = screen.getByLabelText(/message/i);
        const button = screen.getByRole("button", { name: /submit/i });

        // Type into input
        fireEvent.change(input, { target: {value: "Hello world" }});
        expect(input.value).toBe("Hello world");

        // Submit form
        fireEvent.click(button);

        // Wait for async behaviour
        await screen.findByDisplayValue(""); // wait for input to be cleared

        // Assertions
        expect(createPost).toHaveBeenCalledWith(mockToken, "Hello world");
        expect(mockOnPostCreated).toHaveBeenCalledWith(mockPost);
    });

    test("does not call onPostCreated if createPost fails", async () => {
        createPost.mockRejectedValueOnce(new Error("Server error"));

        const mockOnPostCreated = vi.fn();

        render(<CreatePostForm token={mockToken} onPostCreated={mockOnPostCreated} />);

        const input = screen.getByLabelText(/message/i);
        fireEvent.change(input, { target: { value: "Test failure" } });
        fireEvent.click(screen.getByRole("button", { name: /submit/i }));

        // Wait for async error handling
        await screen.findByDisplayValue("Test failure"); // input should not clear

        expect(createPost).toHaveBeenCalled();
        expect(mockOnPostCreated).not.toHaveBeenCalled();
    });

    }


);