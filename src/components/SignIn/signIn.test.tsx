import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Login from ".";
import { useNavigate } from "react-router-dom";
import { fetchWithAuth } from "../../../api";
import "@testing-library/jest-dom/extend-expect";

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

jest.mock("../../../api", () => ({
  fetchWithAuth: jest.fn(),
}));

describe("Login component", () => {
  const mockNavigate = jest.fn();
  const mockFetchWithAuth = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks(); // Reset mocks before each test
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (fetchWithAuth as jest.Mock).mockReturnValue(mockFetchWithAuth);
  });

  test("renders login form with labels and inputs", () => {
    render(<Login />);

    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();

    const emailInput = screen.getByRole("textbox", { name: /email/i });
    const passwordInput = screen.getByLabelText(/password/i);

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
  });

  test("validates email on blur", () => {
    render(<Login />);

    const emailInput = screen.getByRole("textbox", { name: /email/i });

    userEvent.type(emailInput, "invalid_email");
    fireEvent.blur(emailInput);

    expect(
      screen.getByText("Please enter a valid email address.")
    ).toBeInTheDocument();
  });

  test("validates password length on blur", () => {
    render(<Login />);

    const passwordInput = screen.getByLabelText(/password/i);

    userEvent.type(passwordInput, "short");
    fireEvent.blur(passwordInput);

    expect(
      screen.getByText("Password must be at least 6 characters long.")
    ).toBeInTheDocument();
  });

  test("submits login form with valid data - successful login", async () => {
    (mockFetchWithAuth as jest.Mock).mockResolvedValueOnce({
      token: "valid_token",
    });

    render(<Login />);

    const emailInput = screen.getByRole("textbox", { name: /email/i });
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /Sign In/i });

    userEvent.type(emailInput, "eve.holt@reqres.in");
    userEvent.type(passwordInput, "cityslicka");
    userEvent.click(submitButton);

    await new Promise((resolve) => setTimeout(resolve, 0)); // Wait for the async call to complete

    expect(mockFetchWithAuth).toHaveBeenCalledWith(
      "https://reqres.in/api/login",
      "POST",
      "",
      { email: "eve.holt@reqres.in", password: "cityslicka" }
    );
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });

  test("submits login form with valid data - login error", async () => {
    (mockFetchWithAuth as jest.Mock).mockRejectedValueOnce(
      new Error("User does not exist.")
    );

    render(<Login />);

    const emailInput = screen.getByRole("textbox", { name: /email/i });
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /Sign In/i });

    userEvent.type(emailInput, "eve.holt@reqres.in");
    userEvent.type(passwordInput, "cityslicka");
    userEvent.click(submitButton);

    await new Promise((resolve) => setTimeout(resolve, 0)); // Wait for the async call to complete

    expect(mockFetchWithAuth).toHaveBeenCalledWith(
      "https://reqres.in/api/login",
      "POST",
      "",
      { email: "eve.holt@reqres.in", password: "cityslicka" }
    );
    expect(
      screen.getByText("User does not exist. Please sign up first.")
    ).toBeInTheDocument();
  });
});
