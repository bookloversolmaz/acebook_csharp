import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { useNavigate } from "react-router-dom";
import { login, checkEmail } from "../../src/services/authentication";
import { LoginPage } from "../../src/pages/Login/LoginPage";

  const navigateMock = vi.fn();
// Mocking React Router's useNavigate function
vi.mock("react-router-dom", () => {

  const useNavigateMock = () => navigateMock; // Create a mock function for useNavigate
  return { useNavigate: useNavigateMock };
});

// Mocking the login service
vi.mock("../../src/services/authentication", () => {
  const loginMock = vi.fn();
  const checkEmailMock = vi.fn();
  return { login: loginMock, checkEmail:checkEmailMock };
});

// Reusable function for filling out login form
const completeLoginForm = async () => {
  const user = userEvent.setup();

  const emailInputEl = screen.getByLabelText("Email:");
  const passwordInputEl = screen.getByLabelText("Password:");
  const submitButtonEl = screen.getByRole("submit-button");

  await user.type(emailInputEl, "test@email.com");
  await user.type(passwordInputEl, "Secret123!");
  await user.click(submitButtonEl);
};

describe("Login Page", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test("allows a user to login", async () => {
    window.alert = vi.fn();

    render(<LoginPage />);
    

    await completeLoginForm();

    expect(login).toHaveBeenCalledWith("test@email.com", "Secret123!");
  });

  test("navigates to /posts on successful login", async () => {
    window.alert = vi.fn();
    render(<LoginPage />);

    login.mockResolvedValue("secrettoken123");
    const navigateMock = useNavigate();

    await completeLoginForm();

    expect(navigateMock).toHaveBeenCalledWith("/posts");
  });

  test("navigates to /login on unsuccessful login", async () => {
    window.alert = vi.fn();

    render(<LoginPage />);

    const user = userEvent.setup();

    const emailInputEl = screen.getByLabelText("Email:");
    const passwordInputEl = screen.getByLabelText("Password:");
    const submitButtonEl = screen.getByRole("submit-button");

    await user.type(emailInputEl, "test@email.com");
    await user.type(passwordInputEl, "23!");
    await user.click(submitButtonEl);
    expect(window.alert).toHaveBeenCalledWith('Your email or password is incorrect. Please provide correct information.')

    expect(navigateMock).toHaveBeenCalledWith("/login");
  });

  test("Given an incorrect email, an alert is provided", async () => {
    window.alert = vi.fn();

    render(<LoginPage />)
    
    const user = userEvent.setup();

    const emailInputEl = screen.getByLabelText("Email:");
    const passwordInputEl = screen.getByLabelText("Password:");
    const submitButtonEl = screen.getByRole("submit-button");

    await user.type(emailInputEl, "testemail.com");
    await user.type(passwordInputEl, "Secret123!");
    await user.click(submitButtonEl);

    expect(window.alert).toHaveBeenCalledWith('Your email or password is incorrect. Please provide correct information.')
  });

test("Given an email that is not in the db, an alert is provided", async () => {
    checkEmail.mockResolvedValue(false); 
    window.alert = vi.fn();

    render(<LoginPage />)

    const user = userEvent.setup();

    const emailInputEl = screen.getByLabelText("Email:");
    const passwordInputEl = screen.getByLabelText("Password:");
    const submitButtonEl = screen.getByRole("submit-button");

    await user.type(emailInputEl, "notsignedup@email.com");
    await user.type(passwordInputEl, "Secret123!");
    await user.click(submitButtonEl);

    expect(window.alert).toHaveBeenCalledWith('This email has not been registered. Please sign up first.')
  });


});
