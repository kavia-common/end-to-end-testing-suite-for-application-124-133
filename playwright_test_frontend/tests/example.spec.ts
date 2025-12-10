import { test, expect } from '@playwright/test';

/**
 * PUBLIC_INTERFACE
 * Example E2E test that:
 * - Navigates to the configured baseURL (from playwright.config.ts)
 * - Asserts that the page has loaded by checking title presence and a visible element
 */
test('home page loads and shows content', async ({ page, baseURL }) => {
  const url = baseURL || 'http://localhost:3000';
  await page.goto(url);

  // Title assertion is flexible: CRA default is "React App"
  const title = await page.title();
  expect(title).toBeTruthy();

  // Check for a known element on the page from the template (Learn React link)
  const learnReact = page.getByRole('link', { name: /learn react/i });
  await expect(learnReact).toBeVisible();
});
