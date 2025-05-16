import { render, screen } from "@testing-library/react";

import Username from "../../src/components/UserDetails/Username";

describe("Username", () => {
    test("displays the user's username", () => {
        const testUser = { 
            _id: "123", 
            Username: "testuser1", 
            Email: "testuser1@example.com", 
            Password: "Secret123!" };
        render(<Username Username={testUser.Username} />);

        const heading = screen.getByRole("heading", { level: 3 });
        expect(heading.textContent).toBe("testuser1");
    });
});