import { render, screen, waitFor } from "@testing-library/react";
import { assert, describe, vi } from 'vitest';

import DisplayAllCommentsForAPost from "../../src/components/Comments/DisplayAllCommentsForAPost";
import { getCommentsByPostId } from "../../src/services/comments";

// Setup mock for getCommentsByPostId Service
vi.mock("../../src/services/comments", () => {
    const getCommentsByPostIdMock = vi.fn();
    return { getCommentsByPostId : getCommentsByPostIdMock };
});

// Mock IndividualCommentsDisplay component
vi.mock("../../src/Components/IndividualCommentDisplay", () => ({
    default: ({ comment }) => <div data-testid="comment-message">{comment.message}</div>,
}));

vi.mock("../../src/components/Comments/CreateCommentForm", () => ({
    default: ({ onCommentCreated }) => (
        <button onClick={() => onCommentCreated({ _id: "3", message: "New comment" })}>
        Mock Submit
        </button>
    ),
}));

describe("DisplayAllCommentsForAPost component", () => {
    // eslint-disable-next-line vitest/expect-expect
    test("renders comments fetched from API", async () => {
        getCommentsByPostId.mockResolvedValueOnce({
            comments: [
                { _id: "1", message: "First Comment" },
                { _id: "2", message: "Second Comment" },
            ],
        });

        render(
            <DisplayAllCommentsForAPost token="mock-token" postId="123" />
        );

        await waitFor(() => {
            assert.exists(screen.queryByText("First Comment"));
            assert.exists(screen.queryByText("Second Comment"));
        })
    });

    // eslint-disable-next-line vitest/expect-expect
    test("adds new comment when onCommentCreated is called", async () => {
        getCommentsByPostId.mockResolvedValueOnce({
            comments: [
                { _id: "1", message: "Comment 1" },
                { _id: "2", message: "Comment 2" },
            ],
        });

        render(
            <DisplayAllCommentsForAPost token="mock-token" postId="123" />
        );

        screen.getByText("Mock Submit").click();
        const comments = await screen.findAllByTestId("comment-message");
        expect(comments[0].textContent).toBe("New comment");

    }

    )
}); 