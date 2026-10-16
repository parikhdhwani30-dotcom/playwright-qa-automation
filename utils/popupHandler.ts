import { Page } from '@playwright/test';

export async function handlePopups(page: Page) {
  try {
    // 🔹 Small wait to allow popup to render (non-blocking)
    await page.waitForTimeout(1500);

    const cancelPopupBtn = page.locator('button[dismissmodal]');

    if (await cancelPopupBtn.first().isVisible().catch(() => false)) {
      await cancelPopupBtn.first().click({ force: true });
      console.log('❎ Notification popup closed');
    } else {
      console.log('ℹ️ No notification popup present');
    }
  } catch (error) {
    console.log('⚠️ Popup handler skipped due to error:', error);
  }
}
