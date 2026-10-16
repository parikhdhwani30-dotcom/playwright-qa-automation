// utils/allureScreenshot.ts
import { Page, TestInfo } from '@playwright/test';

/**
 * Attach screenshot to Allure report
 * @param page - Playwright Page instance
 * @param testInfo - Playwright TestInfo object
 * @param name - Name of the screenshot to appear in Allure
 */
export async function attachScreenshot(
  page: Page,
  testInfo: TestInfo,
  name: string
) {
  // Take screenshot
  const screenshotBuffer = await page.screenshot({ fullPage: true });

  // Attach to Allure
  await testInfo.attach(name, {
    body: screenshotBuffer,
    contentType: 'image/png',
  });
}
