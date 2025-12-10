import { test, expect } from '@playwright/test';

/**
 * PUBLIC_INTERFACE
 * Home page smoke tests
 * - Validates page load and primary link presence ("Learn React")
 *
 * Mapping traceability:
 * - Row: Primary Link -> role=link[name=/Learn React/i] with class .App-link
 */

test.describe('Home - Smoke', () => {
  test.beforeEach(async ({ page, baseURL }) => {
    const url = baseURL || `http://localhost:${process.env.REACT_APP_PORT?.trim() || '3000'}`;
    await page.goto(url);
  });

  test('loads and shows Learn React link', async ({ page }) => {
    const link = page.getByRole('link', { name: /learn react/i });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('href', 'https://reactjs.org');
  });

  test('has a non-empty title', async ({ page }) => {
    const title = await page.title();
    expect(title).toBeTruthy();
  });
});
