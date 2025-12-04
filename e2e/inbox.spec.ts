import { test, expect } from "@playwright/test";

test.describe("Inbox - core flows", () => {
  test("loads inbox, can search, and respects partner config", async ({
    page,
  }) => {
    await page.goto("/");

    // Netflix invoice is visible on initial load
    await expect(
      page.getByText(/Your monthly invoice is ready/i)
    ).toBeVisible();

    // Search by sender
    const searchInput = page.getByRole("textbox", { name: /search/i });
    await searchInput.fill("Netflix");

    await expect(page.getByText(/Netflix/i)).toBeVisible();
    await expect(
      page.getByText(/Your monthly invoice is ready/i)
    ).toBeVisible();

    // Search for non-existing text
    await searchInput.fill("this-does-not-exist-123");
    await expect(
      page.getByText(/No messages match your search/i)
    ).toBeVisible();
  });

  test("partner switcher toggles snippet and spam action (A → B)", async ({
    page,
  }) => {
    await page.goto("/");

    // For Partner A (default), snippet for Netflix invoice is visible
    await expect(
      page.getByText(
        /Your HD subscription bill for this month is now available/i
      )
    ).toBeVisible();

    // Switch to Partner B — second combobox on the page (first is theme preference)
    const partnerSelect = page.getByRole("combobox").nth(1);
    await partnerSelect.selectOption("partnerB");

    // Snippet should no longer be visible for Partner B
    await expect(
      page.getByText(
        /Your HD subscription bill for this month is now available/i
      )
    ).not.toBeVisible();

    // "Mark Spam" button should now be visible in toolbar for Partner B
    await expect(
      page.getByRole("button", { name: /mark spam/i })
    ).toBeVisible();
  });
});
