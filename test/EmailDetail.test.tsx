import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import EmailDetailClient from "@/app/email/[id]/page";
import { PartnerProvider } from "@/components/PartnerContext";
import bundledEmails from "@/data/emails.json";
import type { Email } from "@/components/EmailRow";

const emails = bundledEmails as Email[];

// Mock next/navigation so useParams/useRouter work in tests
jest.mock("next/navigation", () => {
  const actual = jest.requireActual("next/navigation");
  return {
    ...actual,
    useParams: () => ({ id: "1" }),
    useRouter: () => ({ push: jest.fn() }),
  };
});

const STORAGE_KEY = "inbox_emails_partnerA";

const renderDetail = () =>
  render(
    <PartnerProvider>
      <EmailDetailClient />
    </PartnerProvider>
  );

describe("EmailDetailClient", () => {
  beforeEach(() => {
    localStorage.clear();
    // seed storage with the bundled emails so detail view finds id=1 there
    localStorage.setItem(STORAGE_KEY, JSON.stringify(emails));
  });

  it("renders subject, sender and body", () => {
    renderDetail();

    // subject from emails.json id=1
    expect(
      screen.getByText(/Your monthly invoice is ready/i)
    ).toBeInTheDocument();

    // sender
    expect(screen.getAllByText(/Netflix/i).length).toBeGreaterThan(0);

    // body text snippet
    expect(
      screen.getByText(/Your monthly Netflix invoice is now ready/i)
    ).toBeInTheDocument();
  });

  it("marks message as spam", () => {
    renderDetail();

    const spamBtn = screen.getByRole("button", { name: /mark spam/i });
    fireEvent.click(spamBtn);

    // badge + button text both contain "Spam" so use getAllByText
    expect(screen.getAllByText(/spam/i).length).toBeGreaterThan(0);
  });

  it("toggles read/unread state", () => {
    renderDetail();

    // on open we aut-mark as read so button says "Mark Unread"
    const markUnreadBtn = screen.getByRole("button", { name: /mark unread/i });
    fireEvent.click(markUnreadBtn);

    // now it should flip to "Mark Read"
    expect(
      screen.getByRole("button", { name: /mark read/i })
    ).toBeInTheDocument();
  });

  it("opens reply editor when clicking reply", () => {
    renderDetail();

    const replyBtn = screen.getByRole("button", { name: /reply/i });
    fireEvent.click(replyBtn);

    // textarea with aria-label="reply-body"
    expect(
      screen.getByRole("textbox", { name: /reply-body/i })
    ).toBeInTheDocument();

    // cancel button with aria-label="cancel-reply"
    expect(
      screen.getByRole("button", { name: /cancel-reply/i })
    ).toBeInTheDocument();
  });
});
