import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SignUp from ".";
import { useNavigate } from "react-router-dom";
import { fetchWithAuth } from "../../../api";
import "@testing-library/jest-dom/extend-expect"; // Import for custom matchers

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

jest.mock("../../../api", () => ({
  fetchWithAuth: jest.fn(),
}));

describe("SignUp component", () => {
  const mockNavigate = jest.fn();
  const mockFetchWithAuth = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (fetchWithAuth as jest.Mock).mockReturnValue(mockFetchWithAuth);
  });

  test("renders sign-up form with labels and inputs", () => {
    render(<SignUp />);

    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contact Number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument();

    const nameInput = screen.getByRole("textbox", { name: /Name/i });
    const contactNumberInput = screen.getByRole("textbox", {
      name: /Contact Number/i,
    });
    const emailInput = screen.getByRole("textbox", { name: /Email/i });
    const passwordInput = screen.getByLabelText(/Password/i);
    const confirmPasswordInput = screen.getByLabelText(/Confirm Password/i);

    expect(nameInput).toBeInTheDocument();
    expect(contactNumberInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(confirmPasswordInput).toBeInTheDocument();
  });

  test("validates email on blur", () => {
    render(<SignUp />);

    const emailInput = screen.getByRole("textbox", { name: /Email/i });

    userEvent.type(emailInput, "invalid_email");
    fireEvent.blur(emailInput);

    expect(
      screen.getByText("Please enter a valid email address.")
    ).toBeInTheDocument();
  });

  test("validates contact number on blur", () => {
    render(<SignUp />);

    const contactNumberInput = screen.getByRole("textbox", {
      name: /Contact Number/i,
    });

    userEvent.type(contactNumberInput, "12345");
    fireEvent.blur(contactNumberInput);

    expect(
      screen.getByText("Contact number must be 10 digits long.")
    ).toBeInTheDocument();
  });

  test("validates password length on blur", () => {
    render(<SignUp />);

    const passwordInput = screen.getByLabelText(/Password/i);

    userEvent.type(passwordInput, "short");
    fireEvent.blur(passwordInput);

    expect(
      screen.getByText("Password must be at least 6 characters long.")
    ).toBeInTheDocument();
  });

  test("validates confirm password on blur", () => {
    render(<SignUp />);

    const passwordInput = screen.getByLabelText(/Password/i);
    const confirmPasswordInput = screen.getByLabelText(/Confirm Password/i);

    userEvent.type(passwordInput, "password123");
    userEvent.type(confirmPasswordInput, "differentpassword");
    fireEvent.blur(confirmPasswordInput);

    expect(screen.getByText("Passwords do not match.")).toBeInTheDocument();
  });

  test("submits sign-up form with valid data - successful signup", async () => {
    (mockFetchWithAuth as jest.Mock).mockResolvedValueOnce({
      token: "valid_token",
    });

    render(<SignUp />);

    const nameInput = screen.getByRole("textbox", { name: /Name/i });
    const contactNumberInput = screen.getByRole("textbox", {
      name: /Contact Number/i,
    });
    const emailInput = screen.getByRole("textbox", { name: /Email/i });
    const passwordInput = screen.getByLabelText(/Password/i);
    const confirmPasswordInput = screen.getByLabelText(/Confirm Password/i);
    const submitButton = screen.getByRole("button", { name: /Sign Up/i });

    userEvent.type(nameInput, "John Doe");
    userEvent.type(contactNumberInput, "1234567890");
    userEvent.type(emailInput, "valid@email.com");
    userEvent.type(passwordInput, "password123");
    userEvent.type(confirmPasswordInput, "password123");
    userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockFetchWithAuth).toHaveBeenCalledWith(
        "https://reqres.in/api/register",
        "POST",
        "",
        {
          email: "valid@email.com",
          password: "password123",
        }
      );
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    });
  });

  test("submits sign-up form with valid data - signup error", async () => {
    (mockFetchWithAuth as jest.Mock).mockRejectedValueOnce(
      new Error("Signup failed.")
    );

    render(<SignUp />);

    const nameInput = screen.getByRole("textbox", { name: /Name/i });
    const contactNumberInput = screen.getByRole("textbox", {
      name: /Contact Number/i,
    });
    const emailInput = screen.getByRole("textbox", { name: /Email/i });
    const passwordInput = screen.getByLabelText(/Password/i);
    const confirmPasswordInput = screen.getByLabelText(/Confirm Password/i);
    const submitButton = screen.getByRole("button", { name: /Sign Up/i });

    userEvent.type(nameInput, "John Doe");
    userEvent.type(contactNumberInput, "1234567890");
    userEvent.type(emailInput, "valid@email.com");
    userEvent.type(passwordInput, "password123");
    userEvent.type(confirmPasswordInput, "password123");
    userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockFetchWithAuth).toHaveBeenCalledWith(
        "https://reqres.in/api/register",
        "POST",
        "",
        {
          email: "valid@email.com",
          password: "password123",
        }
      );
      expect(
        screen.getByText("Signup failed. Please try again.")
      ).toBeInTheDocument();
    });
  });
});
