import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import Navbar from "./Navbar";

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router", () => ({
  useNavigate: () => mockNavigate,
}));

describe("Navbar Component", () => {
  it("renders Navbar correctly", () => {
    render(<Navbar />);

    expect(screen.getByText("Journal Organizer")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign up/i }),
    ).toBeInTheDocument();
  });

  it("navigates to login page when Sign In button is clicked", async () => {
    render(<Navbar />);

    const signInButton = screen.getByRole("button", { name: /sign in/i });
    await userEvent.click(signInButton);

    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  it("navigates to register page when Sign Up button is clicked", async () => {
    render(<Navbar />);

    const signUpButton = screen.getByRole("button", { name: /sign up/i });
    await userEvent.click(signUpButton);

    expect(mockNavigate).toHaveBeenCalledWith("/register");
  });
});
