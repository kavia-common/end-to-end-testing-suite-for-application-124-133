import { test, expect } from '@playwright/test';

/**
 * End-to-end tests for LeadSquared Form Flow (test2).
 * Base URL and selectors are taken strictly from the provided locator mapping document:
 * - Base URL: https://app.leadsquared.com
 * - Selectors:
 *   - iframe: [data-testid="iframe"]
 *   - Input: getByTestId('lsq-form-field-input-test')
 *   - Continue button: getByRole('button', { name: 'Continue' })
 *   - Success heading: getByRole('heading', { name: 'DND_task_demo2' })
 *
 * The exact steps and expected results are taken from the Excel test case sheet.
 */

// URL paths adapted from the locator mapping with the same query parameters/orderings.
// Note: The mapping document included an NBSP at the end of '2006'; we keep the encoded value (%C2%A0) per the source.
const FORM_PATH = '/Form/Edit?Id=265cf80f-7c4c-4af6-88a6-76de0d250422&assetsVersion=1764070156527_2006%C2%A0';
const FORM_PATH_ALT = '/Form/Edit?assetsVersion=1764070156527_2006%C2%A0&Id=265cf80f-7c4c-4af6-88a6-76de0d250422';

const IFRAME_SELECTOR = '[data-testid="iframe"]';
const FIELD_TEST_ID = 'lsq-form-field-input-test';
const CONTINUE_LABEL = 'Continue';
const SUCCESS_HEADING = 'DND_task_demo2';

test.describe('LeadSquared Form Flow (test2)', () => {
  // PUBLIC_INTERFACE
  test('TC_POS_001 - Successful Form Submission with Valid Credentials', async ({ page }) => {
    /**
     * This test follows TC_POS_001 from the Excel:
     * 1) Navigate to the form URL
     * 2) Inside iframe: enter a valid email
     * 3) Click "Continue"
     * 4) Inside iframe: enter a valid password/second step input
     * 5) Click "Continue"
     * 6) Verify success by presence of heading "DND_task_demo2"
     */

    // Step 1: Navigate to the form URL using the baseURL from config
    await page.goto(FORM_PATH);

    // Work inside the form iframe using only selectors from the mapping doc
    const frame = page.frameLocator(IFRAME_SELECTOR);

    // Step 2: Enter valid email
    await frame.getByTestId(FIELD_TEST_ID).click();
    await frame.getByTestId(FIELD_TEST_ID).fill('testuser_demo2@lsqdev.in');

    // Step 3: Click Continue
    await frame.getByRole('button', { name: CONTINUE_LABEL }).click();

    // Step 4: Enter valid password/second step input
    await frame.getByTestId(FIELD_TEST_ID).fill('Qwerty1@');

    // Step 5: Click Continue
    await frame.getByRole('button', { name: CONTINUE_LABEL }).click();

    // The locator mapping performed a follow-up navigation; replicate for parity
    await page.goto(FORM_PATH_ALT);

    // Step 6: Verify success heading present
    await expect(frame.getByRole('heading', { name: SUCCESS_HEADING })).toBeVisible();
  });

  // PUBLIC_INTERFACE
  test('TC_NEG_001 - Form Submission Failure with Invalid Second Step Input', async ({ page }) => {
    /**
     * This test follows TC_NEG_001 from the Excel:
     * 1) Navigate to the form URL
     * 2) Inside iframe: enter a valid email
     * 3) Click "Continue"
     * 4) Inside iframe: enter an invalid password/second step input
     * 5) Click "Continue"
     * 6) Verify that success state is not reached (no "DND_task_demo2" heading); optionally the form still shows an actionable state.
     */

    // Step 1: Navigate to the form URL using the baseURL from config
    await page.goto(FORM_PATH);

    const frame = page.frameLocator(IFRAME_SELECTOR);

    // Step 2: Enter valid email
    await frame.getByTestId(FIELD_TEST_ID).click();
    await frame.getByTestId(FIELD_TEST_ID).fill('testuser_demo2@lsqdev.in');

    // Step 3: Click Continue
    await frame.getByRole('button', { name: CONTINUE_LABEL }).click();

    // Step 4: Enter invalid password/second step input
    await frame.getByTestId(FIELD_TEST_ID).fill('invalidpass');

    // Step 5: Click Continue
    await frame.getByRole('button', { name: CONTINUE_LABEL }).click();

    // Step 6: Verify failure outcome:
    // - The success heading must NOT be present.
    await expect(frame.getByRole('heading', { name: SUCCESS_HEADING })).toHaveCount(0);

    // As an additional stability check that the form remains interactive,
    // ensure the Continue button is still visible within the iframe.
    await expect(frame.getByRole('button', { name: CONTINUE_LABEL })).toBeVisible();
  });
});
