import { defineConfig, devices } from '@playwright/test';

/**
 * PUBLIC_INTERFACE
 * Playwright Test configuration.
 * - testDir: where tests live
 * - reporter: list (CI-friendly)
 * - use.baseURL: fixed base URL sourced from the locator mapping document
 * - timeout: reasonable defaults for e2e
 *
 * Note: Per requirements, do not use React app environment variables for baseURL.
 */
const baseURL = 'https://app.leadsquared.com';

export default defineConfig({
  testDir: 'tests',
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: 'list',
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10_000,
    navigationTimeout: 15_000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    }
  ],
});
