import { test, expect } from '@playwright/test';

/**
 * PUBLIC_INTERFACE
 * Theme toggle test cases based on locator mapping rows for the theme switch control.
 * - Uses baseURL from Playwright config or REACT_APP_FRONTEND_URL
 * - Verifies initial state, toggles theme, and checks aria-label/text content updates
 *
 * Mapping traceability:
 * - Row: Theme Toggle Button -> role=button[name=/Dark|Light/] with .theme-toggle class
 */

test.describe('Theme - Toggle Button', () => {
  test.beforeEach(async ({ page, baseURL }) => {
    const url = baseURL || `http://localhost:${process.env.REACT_APP_PORT?.trim() || '3000'}`;
    await page.goto(url);
    // basic assertion: page loaded with known element
    await expect(page.getByRole('link', { name: /learn react/i })).toBeVisible({ timeout: 5000 });
  });

  test('should render theme toggle with correct initial state', async ({ page }) => {
    // Using accessible name per mapping (button text contains emoji + "Dark" or "Light")
    const toggle = page.getByRole('button', { name: /dark|light/i });
    await expect(toggle).toBeVisible();

    // Assert aria-label describes action (switch to ... mode)
    await expect(toggle).toHaveAttribute('aria-label', /Switch to (dark|light) mode/i);

    // Content should include emoji and label
    await expect(toggle).toContainText(/Dark|Light/);
  });

  test('should toggle theme and update aria-label and text', async ({ page }) => {
    const toggle = page.getByRole('button', { name: /dark|light/i });
    const beforeLabel = await toggle.getAttribute('aria-label');
    const beforeText = await toggle.textContent();

    await toggle.click();

    // After click, aria-label and button text should flip
    await expect(toggle).toHaveAttribute('aria-label', /Switch to (dark|light) mode/i);
    await expect(toggle).toContainText(/Dark|Light/);

    const afterLabel = await toggle.getAttribute('aria-label');
    const afterText = await toggle.textContent();

    expect(afterLabel).not.toEqual(beforeLabel);
    expect(afterText).not.toEqual(beforeText);
  });
});
