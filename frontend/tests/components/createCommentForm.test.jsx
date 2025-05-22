import { render, screen, fireEvent } from "@testing-library/react";
import CreateCommentForm from "../../src/components/Comments/CreateCommentForm";
import { vi } from "vitest";
import { createComment } from "../../src/services/comments";

vi.mock("../../src/services/comments", () => ({
    createComment: vi.fn()
}));

describe("CreateCommentForm", () => {
    const mockToken = "mock-token";

    test("calls createComment and onCommentCreated on form submit", async () => {
        const mockComment = { postId: "123", message: "Test Comment 1" }; // Changed from _id to postId
        createComment.mockResolvedValueOnce({ comment: mockComment });

        const mockOnCommentCreated = vi.fn();

        render(<CreateCommentForm token={mockToken} onCommentCreated={mockOnCommentCreated} postId={mockComment.postId}/>)

        const input = screen.getByLabelText(/comment message/i);
        const button = screen.getByRole("button", { name: /submit/i });

        // Type into input
        fireEvent.change(input, { target: {value: "Test Comment 1" }});
        expect(input.value).toBe("Test Comment 1");

        // Submit form
        fireEvent.click(button);

        // Wait for async behaviour
        // await waitFor(() => {
        // expect(screen.getByLabelText(/comment message/i).value).toBe("");
        // });
        await screen.findByDisplayValue(""); // wait for input to be cleared

        // Assertions
        expect(createComment).toHaveBeenCalledWith(mockToken, "Test Comment 1", mockComment.postId);
        expect(mockOnCommentCreated).toHaveBeenCalledWith(mockComment);
    });

    test("does not call onPostCreated if createPost fails", async () => {
        createComment.mockRejectedValueOnce(new Error("Server error"));

        const mockOnCommentCreated = vi.fn();

        render(<CreateCommentForm token={mockToken} onPostCreated={mockOnCommentCreated} />);

        const input = screen.getByLabelText(/comment message/i);
        fireEvent.change(input, { target: { value: "Test failure" } });
        fireEvent.click(screen.getByRole("button", { name: /submit/i }));

        // Wait for async error handling
        await screen.findByDisplayValue("Test failure"); // input should not clear

        expect(createComment).toHaveBeenCalled();
        expect(mockOnCommentCreated).not.toHaveBeenCalled();
    });

    }


);