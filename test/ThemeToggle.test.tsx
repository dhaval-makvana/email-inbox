import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ThemeToggle from "@/components/ThemeToggle";

describe("ThemeToggle", () => {
  beforeEach(() => {
    document.documentElement.className = "";
    document.documentElement.removeAttribute("data-color-scheme");
    localStorage.clear();
  });

  it("toggles dark class on html when button is clicked", () => {
    render(<ThemeToggle />);

    const button = screen.getByRole("button", { name: /toggle dark mode/i });

    expect(document.documentElement.classList.contains("dark")).toBe(false);

    fireEvent.click(button);
    expect(document.documentElement.classList.contains("dark")).toBe(true);

    fireEvent.click(button);
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });
});
