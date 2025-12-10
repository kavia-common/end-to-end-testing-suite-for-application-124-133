# Playwright JavaScript Tests

This folder contains Playwright tests written in JavaScript using `@playwright/test`.  
They mirror the user flows defined in `kavia-docs/locator-mapping-test2.md` and use the exact selectors referenced there.

- Base URL is configured per test via:
  `test.use({ baseURL: process.env.REACT_APP_FRONTEND_URL || 'http://localhost:3000' })`

- To run only the JS suite:
  `npm run test:e2e:js`

Notes:
- Keep existing TypeScript tests untouched.
- If you update selectors or flows in the locator mapping doc, reflect those changes here to keep parity.
