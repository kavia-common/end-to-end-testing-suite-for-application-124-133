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
  // helper to generate consistent screenshot filenames and attach to report folder
  async function snap(page: any, testInfo: any, id: string, step: string) {
    const file = testInfo.outputPath(`${id}_${step}.png`);
    await page.screenshot({ path: file, fullPage: true });
    await testInfo.attach(`${id}_${step}`, { path: file, contentType: 'image/png' });
  }

  // PUBLIC_INTERFACE
  test('TC_POS_001 - Successful Form Submission with Valid Credentials', async ({ page }, testInfo) => {
    /**
     * This test follows TC_POS_001 from the Excel:
     * 1) Navigate to the form URL
     * 2) Inside iframe: enter a valid email
     * 3) Click "Continue"
     * 4) Inside iframe: enter a valid password/second step input
     * 5) Click "Continue"
     * 6) Verify success by presence of heading "DND_task_demo2"
     */

    const TID = 'TC_POS_001';

    // Step 1: Navigate to the form URL using the baseURL from config
    await page.goto(FORM_PATH);
    await snap(page, testInfo, TID, '01_initial_navigation');

    // Work inside the form iframe using only selectors from the mapping doc
    const frame = page.frameLocator(IFRAME_SELECTOR);
    await snap(page, testInfo, TID, '02_after_iframe_available');

    // Step 2: Enter valid email
    await frame.getByTestId(FIELD_TEST_ID).click();
    await frame.getByTestId(FIELD_TEST_ID).fill('testuser_demo2@lsqdev.in');
    await snap(page, testInfo, TID, '03_after_email_fill');

    // Step 3: Click Continue
    await frame.getByRole('button', { name: CONTINUE_LABEL }).click();
    await snap(page, testInfo, TID, '04_after_first_continue');

    // Step 4: Enter valid password/second step input
    await frame.getByTestId(FIELD_TEST_ID).fill('Qwerty1@');
    await snap(page, testInfo, TID, '05_after_password_fill');

    // Step 5: Click Continue
    await frame.getByRole('button', { name: CONTINUE_LABEL }).click();
    await snap(page, testInfo, TID, '06_after_second_continue');

    // The locator mapping performed a follow-up navigation; replicate for parity
    await page.goto(FORM_PATH_ALT);
    await snap(page, testInfo, TID, '07_after_followup_navigation');

    // Step 6: Verify success heading present
    await expect(frame.getByRole('heading', { name: SUCCESS_HEADING })).toBeVisible(20000);
    await snap(page, testInfo, TID, '08_final_assert_success_visible');
  });

  // PUBLIC_INTERFACE
  test('TC_NEG_001 - Form Submission Failure with Invalid Second Step Input', async ({ page }, testInfo) => {
    /**
     * This test follows TC_NEG_001 from the Excel:
     * 1) Navigate to the form URL
     * 2) Inside iframe: enter a valid email
     * 3) Click "Continue"
     * 4) Inside iframe: enter an invalid password/second step input
     * 5) Click "Continue"
     * 6) Verify that success state is not reached (no "DND_task_demo2" heading); optionally the form still shows an actionable state.
     */

    const TID = 'TC_NEG_001';

    // Step 1: Navigate to the form URL using the baseURL from config
    await page.goto(FORM_PATH);
    await snap(page, testInfo, TID, '01_initial_navigation');

    const frame = page.frameLocator(IFRAME_SELECTOR);
    await snap(page, testInfo, TID, '02_after_iframe_available');

    // Step 2: Enter valid email
    await frame.getByTestId(FIELD_TEST_ID).click();
    await frame.getByTestId(FIELD_TEST_ID).fill('testuser_demo2@lsqdev.in');
    await snap(page, testInfo, TID, '03_after_email_fill');

    // Step 3: Click Continue
    await frame.getByRole('button', { name: CONTINUE_LABEL }).click();
    await snap(page, testInfo, TID, '04_after_first_continue');

    // Step 4: Enter invalid password/second step input
    await frame.getByTestId(FIELD_TEST_ID).fill('invalidpass');
    await snap(page, testInfo, TID, '05_after_invalid_password_fill');

    // Step 5: Click Continue
    await frame.getByRole('button', { name: CONTINUE_LABEL }).click();
    await snap(page, testInfo, TID, '06_after_second_continue');

    // Step 6: Verify failure outcome:
    // - The success heading must NOT be present.
    await expect(frame.getByRole('heading', { name: SUCCESS_HEADING })).toHaveCount(0);
    await snap(page, testInfo, TID, '07_final_assert_success_absent');

    // As an additional stability check that the form remains interactive,
    // ensure the Continue button is still visible within the iframe.
    await expect(frame.getByRole('button', { name: CONTINUE_LABEL })).toBeVisible(20000);
    await snap(page, testInfo, TID, '08_continue_visible_post_failure');
  });
});
