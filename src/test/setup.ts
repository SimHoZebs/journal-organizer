import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock browser APIs if needed
vi.stubGlobal(
  "IntersectionObserver",
  class IntersectionObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  },
);
