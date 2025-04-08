import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Login from "./Login";

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router", () => ({
  useNavigate: () => mockNavigate,
}));

// Mock Navbar component
vi.mock("../components/Navbar", () => ({
  default: () => <div data-testid="navbar">Navbar</div>,
}));

// Mock fetch API
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("Login Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("renders login form correctly", () => {
    render(<Login />);

    expect(screen.getByPlaceholderText("User Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
    expect(screen.getByText(/don't have an account\?/i)).toBeInTheDocument();
    expect(screen.getByText(/forgot password/i)).toBeInTheDocument();
  });

  it("shows validation error when fields are empty", async () => {
    render(<Login />);

    const loginButton = screen.getByRole("button", { name: /login/i });
    await userEvent.click(loginButton);

    expect(screen.getByText("Please fill in all fields")).toBeInTheDocument();
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("toggles password visibility when eye icon is clicked", async () => {
    render(<Login />);

    const passwordInput = screen.getByPlaceholderText("Password");
    expect(passwordInput).toHaveAttribute("type", "password");

    const toggleButton = screen.getByAltText("Hide password");
    await userEvent.click(toggleButton);

    expect(passwordInput).toHaveAttribute("type", "text");
    expect(screen.getByAltText("Show password")).toBeInTheDocument();
  });

  it("handles successful login", async () => {
    // Mock successful API response
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          userId: "123",
          token: "fake-token",
          message: "Login successful",
        }),
    });

    render(<Login />);

    await userEvent.type(screen.getByPlaceholderText("User Name"), "testuser");
    await userEvent.type(
      screen.getByPlaceholderText("Password"),
      "password123",
    );

    const loginButton = screen.getByRole("button", { name: /login/i });
    await userEvent.click(loginButton);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({
            username: "testuser",
            password: "password123",
          }),
        }),
      );

      expect(localStorage.getItem("userId")).toBe("123");
      expect(localStorage.getItem("username")).toBe("testuser");
      expect(localStorage.getItem("token")).toBe("fake-token");
      expect(mockNavigate).toHaveBeenCalledWith("/notes");
    });
  });

  it("handles login error", async () => {
    // Mock failed API response
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      text: () =>
        Promise.resolve(JSON.stringify({ error: "Invalid credentials" })),
    });

    render(<Login />);

    await userEvent.type(screen.getByPlaceholderText("User Name"), "wronguser");
    await userEvent.type(screen.getByPlaceholderText("Password"), "wrongpass");

    const loginButton = screen.getByRole("button", { name: /login/i });
    await userEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });
});
