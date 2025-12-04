import { test, expect } from "@playwright/test";

test("toggles dark mode class on <html>", async ({ page }) => {
  await page.goto("/");

  const html = page.locator("html");
  const toggleButton = page.getByRole("button", {
    name: /toggle dark mode/i,
  });

  // Starts in light mode (no dark class)
  await expect(html).not.toHaveClass(/dark/);

  await toggleButton.click();
  await expect(html).toHaveClass(/dark/);

  await toggleButton.click();
  await expect(html).not.toHaveClass(/dark/);
});
