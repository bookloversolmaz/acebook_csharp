import { render, screen } from "@testing-library/react";

import ProfilePicture from "../../src/components/UserDetails/ProfilePicture";

describe("ProfilePicture", () => {
    test("displays the user's profile picture", () => {
        const testUser = { 
            _id: "123", 
            username: "testuser1", 
            email: "testuser1@example.com", 
            password: "Secret123!" ,
            profilepicture : "Profile_Image_Default.png"};
        render(<ProfilePicture profilepicture={testUser.profilepicture} />);
        
        const displayedImage = document.querySelector("img")
        expect(displayedImage).toBeInstanceOf(HTMLImageElement);

        // const image = screen.getByRole("img");
        // expect(image.src).toBe("/Users/avnitabhandal/Desktop/Tutorials/acebook_csharp/frontend/src/assets/Profile_Image_Default.png");
    });
});