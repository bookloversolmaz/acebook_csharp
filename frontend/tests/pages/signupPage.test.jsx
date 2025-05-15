import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { useNavigate } from "react-router-dom";

import { signup } from "../../src/services/authentication";
import { checkEmail } from "../../src/services/authentication";
import { checkUsername } from "../../src/services/authentication";

import { SignupPage } from "../../src/pages/Signup/SignupPage";

const navigateMock = vi.fn();

// Mocking React Router's useNavigate function
vi.mock("react-router-dom", () => {
  return { useNavigate: () => navigateMock };
});

// Mocking the signup service
vi.mock("../../src/services/authentication", () => {
  const signupMock = vi.fn();
  const checkEmailMock = vi.fn();
  const checkUsernameMock = vi.fn();
  return { signup: signupMock, checkEmail: checkEmailMock, checkUsername: checkUsernameMock };
});

// Reusable function for filling out signup form
const completeSignupForm = async () => {
  const user = userEvent.setup();
  const usernameInputEl = screen.getByLabelText("Username:");
  const emailInputEl = screen.getByLabelText("Email:");
  const passwordInputEl = screen.getByLabelText("Password:");
  const submitButtonEl = screen.getByRole("submit-button");

  await user.type(usernameInputEl, "Unique");
  await user.type(emailInputEl, "unique@email.com");
  await user.type(passwordInputEl, "Secret6!");
  await user.click(submitButtonEl);
};

describe("Signup Page", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test("allows a user to signup", async () => {
    checkUsername.mockResolvedValue(false); // username does NOT exist yet
    checkEmail.mockResolvedValue(false);    // email does NOT exist yet
    render(<SignupPage />);
    await completeSignupForm();
    expect(signup).toHaveBeenCalledWith("Unique", "unique@email.com", expect.any(String));
  });

  test("navigates to /login on successful signup", async () => {
    render(<SignupPage />);

    const navigateMock = useNavigate();

    await completeSignupForm();

    expect(navigateMock).toHaveBeenCalledWith("/login");
  });

  test("navigates to /signup on unsuccessful signup", async () => {
    render(<SignupPage />);

    signup.mockRejectedValue(new Error("Error signing up"));
    const navigateMock = useNavigate();

    // await completeSignupForm();
    const user = userEvent.setup();
    const usernameInputEl = screen.getByLabelText("Username:");
    const emailInputEl = screen.getByLabelText("Email:");
    const passwordInputEl = screen.getByLabelText("Password:");
    const submitButtonEl = screen.getByRole("submit-button");

    await user.type(usernameInputEl, "Test");
    await user.type(emailInputEl, "testemail.com");
    await user.type(passwordInputEl, "Fail");
    await user.click(submitButtonEl);

    expect(navigateMock).toHaveBeenCalledWith("/signup");
  });
});
