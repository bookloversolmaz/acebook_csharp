import { render, screen } from "@testing-library/react";

import Username from "../../src/components/UserDetails/Username";

describe("Username", () => {
    test("displays the user's username", () => {
        const testUser = { 
            _id: "123", 
            username: "testuser1", 
            email: "testuser1@example.com", 
            password: "Secret123!" };
        render(<Username username={testUser.username} />);

        const heading = screen.getByRole("heading", { level: 3 });
        expect(heading.textContent).toBe("testuser1");
    });
});