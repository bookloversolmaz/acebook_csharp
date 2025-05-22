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
    default: ({ comment }) => <div>{comment.message}</div>,
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

    // eslint-disable-next-line vitest/expect-expect, vitest/no-commented-out-tests
    // test("adds new comment when onCommentCreated is called", async () => {
    //     getCommentsByPostId.mockResolvedValueOnce({
    //         comments: [
    //             { _id: "1", message: "Comment 1" },
    //             { _id: "2", message: "Comment 2" },
    //         ],
    //     });

    //     render(
    //         <DisplayAllCommentsForAPost token="mock-token" postId="123" />
    //     );

    //     await screen.findByText("");
    //     screen.getByText("Mock Submit").click();

    //     // expect(screen.getByText("New comment")).toBeInTheDocument();
    //     // assert.exists(screen.queryByText("New comment"));
    //     expect(screen.getByTestId('comment-message').textContent).toBe('New comment')
    // }

    // )
});