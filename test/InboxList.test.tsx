import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { InboxList } from "@/components/InboxList";
import { PartnerProvider } from "@/components/PartnerContext";
import { PartnerSwitcher } from "@/components/PartnerSwitcher";
import type { Email } from "@/components/EmailRow";
import bundledEmails from "@/data/emails.json";

const emails = bundledEmails as Email[];

// Basic render: Partner A (default), inbox only
const renderInbox = () =>
  render(
    <PartnerProvider>
      <InboxList initialEmails={emails} />
    </PartnerProvider>
  );

// Render with partner switcher when we need to flip to Partner B
const renderInboxWithSwitcher = () =>
  render(
    <PartnerProvider>
      <PartnerSwitcher />
      <InboxList initialEmails={emails} />
    </PartnerProvider>
  );

describe("InboxList", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders emails with checkbox and subject", () => {
    renderInbox();

    // Subject from id=1 in your JSON
    expect(
      screen.getByText(/Your monthly invoice is ready/i)
    ).toBeInTheDocument();

    // Checkbox for email id=1 (aria-label="select-1")
    expect(screen.getByLabelText("select-1")).toBeInTheDocument();
  });

  it("selects and marks an email as read using the toolbar", () => {
    renderInbox();

    const rowCheckbox = screen.getByLabelText("select-1");
    const markReadBtn = screen.getByRole("button", { name: /mark read/i });

    // Initially disabled because nothing is selected
    expect(markReadBtn).toBeDisabled();

    // Select first email
    fireEvent.click(rowCheckbox);
    expect(rowCheckbox).toBeChecked();
    expect(markReadBtn).not.toBeDisabled();

    // Click "Mark Read"
    fireEvent.click(markReadBtn);

    // After applying action, selection is cleared and button disabled again
    expect(rowCheckbox).not.toBeChecked();
    expect(markReadBtn).toBeDisabled();
  });

  it("filters emails via search (sender or subject)", () => {
    renderInbox();

    const searchInput = screen.getByLabelText(/search/i);

    // Search for "Netflix" (sender of id=1)
    fireEvent.change(searchInput, { target: { value: "Netflix" } });

    expect(screen.getByText(/Netflix/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Your monthly invoice is ready/i)
    ).toBeInTheDocument();

    // Now search for text that should hide this email
    fireEvent.change(searchInput, { target: { value: "non-existing-query" } });

    expect(
      screen.queryByText(/Your monthly invoice is ready/i)
    ).not.toBeInTheDocument();
    expect(
      screen.getByText(/No messages match your search/i)
    ).toBeInTheDocument();
  });

  it("supports bulk Mark Spam and Delete actions under Partner B", () => {
    renderInboxWithSwitcher();

    // Switch to Partner B
    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "partnerB" } });

    // select first email
    const checkbox = screen.getByRole("checkbox", { name: /^select-1$/i });
    fireEvent.click(checkbox);

    // spam button should now be enabled
    const markSpamBtn = screen.getByRole("button", { name: /mark spam/i });
    expect(markSpamBtn).not.toBeDisabled();

    // mark as spam
    fireEvent.click(markSpamBtn);

    // spam state visible on first row
    expect(screen.getAllByText(/spam/i)[0]).toBeInTheDocument();

    // selection was cleared by markSpam; re-select before deleting
    fireEvent.click(checkbox);

    // delete email
    const deleteBtn = screen.getByRole("button", { name: /delete/i });
    expect(deleteBtn).not.toBeDisabled();
    fireEvent.click(deleteBtn);

    // now the first email should be gone
    expect(
      screen.queryByRole("checkbox", { name: /^select-1$/i })
    ).not.toBeInTheDocument();

    // count updated (10 -> 9)
    expect(screen.getByText(/9 messages/i)).toBeInTheDocument();
  });
});
