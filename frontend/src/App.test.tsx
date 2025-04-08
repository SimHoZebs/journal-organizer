import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import App from "./App";

// Mock the page components to simplify testing
vi.mock("./pages/Notes", () => ({
  default: () => <div data-testid="notes-page">Notes Page</div>,
}));

vi.mock("./pages/Login", () => ({
  default: () => <div data-testid="login-page">Login Page</div>,
}));

vi.mock("./pages/SignUp", () => ({
  default: () => <div data-testid="signup-page">SignUp Page</div>,
}));

describe("App Component", () => {
  it("renders without crashing", () => {
    render(<App />);
    expect(document.body).toBeDefined();
  });

  it("redirects to notes page from root route", () => {
    // Use memory router to control the initial route
    render(<App />);
    // The root route should redirect to /notes
    expect(screen.getByTestId("notes-page")).toBeInTheDocument();
  });
});
