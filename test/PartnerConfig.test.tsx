// test/PartnerConfig.test.tsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { PartnerProvider } from "@/components/PartnerContext";
import { PartnerSwitcher } from "@/components/PartnerSwitcher";
import { InboxList } from "@/components/InboxList";
import bundledEmails from "@/data/emails.json";
import type { Email } from "@/components/EmailRow";

const emails = bundledEmails as Email[];

const setup = () =>
  render(
    <PartnerProvider>
      <PartnerSwitcher />
      <InboxList initialEmails={emails} />
    </PartnerProvider>
  );

describe("Partner configuration", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("shows snippet for Partner A and hides for Partner B", () => {
    setup();

    // Snippet is visible by default for Partner A
    expect(
      screen.getByText(
        /Your HD subscription bill for this month is now available/i
      )
    ).toBeInTheDocument();

    // Switch to Partner B — select has no accessible name, so grab the single combobox
    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "partnerB" } });

    // Snippet should disappear for Partner B (since previewSnippet is false)
    expect(
      screen.queryByText(
        /Your HD subscription bill for this month is now available/i
      )
    ).not.toBeInTheDocument();
  });

  it('"Mark Spam" only appears for Partner B', () => {
    setup();

    // In Partner A, spam button should NOT be present in toolbar
    expect(screen.queryByText(/mark spam/i)).not.toBeInTheDocument();

    // Switch to partner B
    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "partnerB" } });

    // Now spam button should be visible
    expect(screen.getByText(/mark spam/i)).toBeInTheDocument();
  });
});
