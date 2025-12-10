const { test, expect } = require('@playwright/test');

/**
 * PUBLIC_INTERFACE
 * Test Suite: Locator Mapping Test 2 (JS)
 * Uses baseURL from REACT_APP_FRONTEND_URL env var or defaults to localhost:3000.
 * Each test title includes the Test Case ID from locator-mapping-test2.md.
 */
test.use({
  baseURL: process.env.REACT_APP_FRONTEND_URL || 'http://localhost:3000',
});

// Utility: navigate to home and ensure page loads
async function gotoHome(page) {
  await page.goto('/');
  // Basic smoke assertion to ensure app is rendered
  await expect(page.locator('body')).toBeVisible();
}

/**
 * PUBLIC_INTERFACE
 * TC-TEST2-001: Verify home page renders and title is visible
 */
test('TC-TEST2-001 | Home page renders with title', async ({ page }) => {
  await gotoHome(page);

  // Replace selectors below with exact selectors from kavia-docs/locator-mapping-test2.md
  // Example placeholder: data-testid or text check
  const title = page.getByTestId('app-title');
  await expect(title).toBeVisible();
});

/**
 * PUBLIC_INTERFACE
 * TC-TEST2-002: Verify navigation to tests dashboard via primary nav
 */
test('TC-TEST2-002 | Navigate to Tests Dashboard from navbar', async ({ page }) => {
  await gotoHome(page);

  // Example exact selector from mapping (replace with mapping-specific one if different)
  const testsNavLink = page.locator('[data-testid="nav-tests"]');
  await testsNavLink.click();
  await expect(page).toHaveURL(/.*\/tests/);

  const dashboardHeader = page.getByTestId('tests-dashboard-title');
  await expect(dashboardHeader).toBeVisible();
});

/**
 * PUBLIC_INTERFACE
 * TC-TEST2-003: Start a sample test run and expect status indicator transitions
 */
test('TC-TEST2-003 | Start sample test run and see status', async ({ page }) => {
  await page.goto('/tests');

  const runButton = page.getByTestId('run-tests');
  await expect(runButton).toBeVisible();
  await runButton.click();

  // Status: running
  const statusRunning = page.getByTestId('status-running');
  await expect(statusRunning).toBeVisible();

  // Eventually pass/fail indicator appears
  const statusDone = page.getByTestId('status-done');
  await expect(statusDone).toBeVisible();
});

/**
 * PUBLIC_INTERFACE
 * TC-TEST2-004: Toggle theme using theme switch and assert attribute/state change
 */
test('TC-TEST2-004 | Toggle theme switch', async ({ page }) => {
  await gotoHome(page);

  const themeToggle = page.getByTestId('theme-toggle');
  await expect(themeToggle).toBeVisible();

  // initial state
  const root = page.locator('html');
  const initialTheme = await root.getAttribute('data-theme');

  await themeToggle.click();
  const toggledTheme = await root.getAttribute('data-theme');

  expect(toggledTheme).not.toBe(initialTheme);
});

/**
 * PUBLIC_INTERFACE
 * TC-TEST2-005: Open test details drawer from a list row
 */
test('TC-TEST2-005 | Open test details from row action', async ({ page }) => {
  await page.goto('/tests');

  const row = page.locator('[data-testid="test-row"]').first();
  await expect(row).toBeVisible();

  const detailsBtn = row.getByTestId('test-row-details');
  await detailsBtn.click();

  const drawer = page.getByTestId('test-details-drawer');
  await expect(drawer).toBeVisible();
});

/**
 * PUBLIC_INTERFACE
 * TC-TEST2-006: Filter tests by status and assert filtered results
 */
test('TC-TEST2-006 | Filter tests by status=passed', async ({ page }) => {
  await page.goto('/tests');

  const filterDropdown = page.getByTestId('filter-status');
  await filterDropdown.click();
  const passedOption = page.getByRole('option', { name: 'Passed' });
  await passedOption.click();

  const appliedChip = page.getByTestId('chip-status-passed');
  await expect(appliedChip).toBeVisible();

  const rows = page.locator('[data-testid="test-row"]');
  const count = await rows.count();
  for (let i = 0; i < count; i++) {
    await expect(rows.nth(i).getByTestId('status-badge-passed')).toBeVisible();
  }
});

/**
 * PUBLIC_INTERFACE
 * TC-TEST2-007: Search tests by name
 */
test('TC-TEST2-007 | Search tests by name', async ({ page }) => {
  await page.goto('/tests');

  const search = page.getByTestId('search-tests');
  await expect(search).toBeVisible();

  await search.fill('smoke');
  await search.press('Enter');

  const resultsInfo = page.getByTestId('search-results-info');
  await expect(resultsInfo).toContainText(/smoke/i);

  // Ensure only matching rows are shown
  const rows = page.locator('[data-testid="test-row"]');
  const count = await rows.count();
  for (let i = 0; i < count; i++) {
    await expect(rows.nth(i)).toContainText(/smoke/i);
  }
});

/**
 * PUBLIC_INTERFACE
 * TC-TEST2-008: Open settings and verify sections
 */
test('TC-TEST2-008 | Open settings and verify sections', async ({ page }) => {
  await gotoHome(page);

  const settingsBtn = page.getByTestId('open-settings');
  await settingsBtn.click();

  const modal = page.getByTestId('settings-modal');
  await expect(modal).toBeVisible();

  await expect(modal.getByTestId('settings-section-general')).toBeVisible();
  await expect(modal.getByTestId('settings-section-advanced')).toBeVisible();

  const close = modal.getByTestId('settings-close');
  await close.click();
  await expect(modal).toBeHidden();
});

/**
 * PUBLIC_INTERFACE
 * TC-TEST2-009: Verify logs panel updates after run
 */
test('TC-TEST2-009 | Logs panel updates post run', async ({ page }) => {
  await page.goto('/tests');

  const runButton = page.getByTestId('run-tests');
  await runButton.click();

  const logs = page.getByTestId('run-logs');
  await expect(logs).toBeVisible();
  await expect(logs).toContainText(/started/i);

  // When complete, expect a completion log line
  await expect(logs).toContainText(/completed/i);
});

/**
 * PUBLIC_INTERFACE
 * TC-TEST2-010: Verify WebSocket status indicator reflects connected state
 */
test('TC-TEST2-010 | WebSocket status shows connected', async ({ page }) => {
  await gotoHome(page);

  const wsIndicator = page.getByTestId('ws-status');
  await expect(wsIndicator).toBeVisible();
  // depending on app behavior there might be a brief transition
  await expect(wsIndicator).toHaveAttribute('data-state', /connected|online/);
});
