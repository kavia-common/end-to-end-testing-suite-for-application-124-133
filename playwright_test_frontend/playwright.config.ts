import { defineConfig, devices } from '@playwright/test';

/**
 * PUBLIC_INTERFACE
 * Playwright Test configuration.
 * - testDir: where tests live
 * - reporter: list (CI-friendly)
 * - use.baseURL: from REACT_APP_FRONTEND_URL or defaults to http://localhost:3000
 * - timeout: reasonable defaults for e2e
 */
const baseURL =
  process.env.REACT_APP_FRONTEND_URL?.trim() ||
  `http://localhost:${process.env.REACT_APP_PORT?.trim() || '3000'}`;

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
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
