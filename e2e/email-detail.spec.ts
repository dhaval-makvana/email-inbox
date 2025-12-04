import { test, expect } from "@playwright/test";

test.describe("Email detail view", () => {
  test("navigates to detail and shows content", async ({ page }) => {
    await page.goto("/");

    // Open email detail by clicking subject link
    await page
      .getByRole("link", { name: /Your monthly invoice is ready/i })
      .click();

    // Heading with subject is visible
    await expect(
      page.getByRole("heading", { name: /Your monthly invoice is ready/i })
    ).toBeVisible();

    // Body content snippet
    await expect(
      page.getByText(/Your monthly Netflix invoice is now ready/i)
    ).toBeVisible();
  });

  test("detail actions: unread/read, spam, reply UI", async ({ page }) => {
    await page.goto("/");

    // Open invoice email
    await page
      .getByRole("link", { name: /Your monthly invoice is ready/i })
      .click();

    // Email is auto-marked read on open => button shows "Mark Unread"
    const markUnreadButton = page.getByRole("button", {
      name: /mark unread/i,
    });
    await markUnreadButton.click();

    // After toggling, button should say "Mark Read"
    await expect(
      page.getByRole("button", { name: /mark read/i })
    ).toBeVisible();

    // Mark as spam
    const markSpamButton = page.getByRole("button", { name: /mark spam/i });
    await markSpamButton.click();

    // In detail view, spam state is reflected by button label switching to "Unmark Spam"
    await expect(
      page.getByRole("button", { name: /unmark spam/i })
    ).toBeVisible();

    // Reply flow: open composer
    const replyButton = page.getByRole("button", { name: /reply/i });
    await replyButton.click();

    const replyBox = page.getByRole("textbox", { name: /reply-body/i });
    await expect(replyBox).toBeVisible();

    await replyBox.fill("Thanks, got the invoice.");
    const sendButton = page.getByRole("button", { name: /send-reply/i });
    await sendButton.click();

    // After send (no-op), composer is closed
    await expect(replyBox).toBeHidden();
  });
});
