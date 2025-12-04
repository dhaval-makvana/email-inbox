import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { EmailRow } from "@/components/EmailRow";
import type { Email } from "@/components/EmailRow";

const baseEmail: Email = {
  id: "1",
  sender: "Netflix",
  subject: "Your monthly invoice is ready",
  snippet: "Your HD subscription bill for this month is now available...",
  date: "2024-02-15T10:00:00Z",
  isRead: false,
  isSpam: false,
};

describe("EmailRow", () => {
  it("renders sender, subject and snippet", () => {
    render(
      <EmailRow
        mail={baseEmail}
        checked={false}
        onToggle={jest.fn()}
        showSnippet
      />
    );

    expect(screen.getByText(/Netflix/)).toBeInTheDocument();
    expect(
      screen.getByText(/Your monthly invoice is ready/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Your HD subscription bill for this month is now available/
      )
    ).toBeInTheDocument();
  });

  it("shows unread dot when isRead is false", () => {
    render(
      <EmailRow
        mail={{ ...baseEmail, isRead: false }}
        checked={false}
        onToggle={jest.fn()}
      />
    );
    expect(screen.getByTitle("Unread")).toBeInTheDocument();
  });

  it("does not show unread dot when isRead is true", () => {
    render(
      <EmailRow
        mail={{ ...baseEmail, isRead: true }}
        checked={false}
        onToggle={jest.fn()}
      />
    );
    expect(screen.queryByTitle("Unread")).not.toBeInTheDocument();
  });

  it("calls onToggle when checkbox is clicked", () => {
    const onToggle = jest.fn();
    render(<EmailRow mail={baseEmail} checked={false} onToggle={onToggle} />);

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    expect(onToggle).toHaveBeenCalledWith(baseEmail.id);
  });

  it("shows spam badge when isSpam is true", () => {
    render(
      <EmailRow
        mail={{ ...baseEmail, isSpam: true }}
        checked={false}
        onToggle={jest.fn()}
      />
    );

    expect(screen.getByText(/Spam/)).toBeInTheDocument();
  });
});
