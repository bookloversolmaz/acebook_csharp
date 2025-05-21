import { render, screen } from "@testing-library/react";

import ProfilePicture from "../../src/components/UserDetails/ProfilePicture";

describe("ProfilePicture", () => {
    test("displays the user's profile picture", () => {
        const testUser = { 
            _id: "123", 
            username: "testuser1", 
            email: "testuser1@example.com", 
            password: "Secret123!" ,
            ProfilePicture: "https://storage.googleapis.com/liberis_training/Profile_Image_Default.png"
            };
        render(<ProfilePicture profilePicture={testUser.ProfilePicture} />);
        
        const displayedImage = document.querySelector("img")
        expect(displayedImage).toBeInstanceOf(HTMLImageElement);

        const image = screen.getByRole("img");
        expect(image.src).toBe("https://storage.googleapis.com/liberis_training/Profile_Image_Default.png");
    });
});