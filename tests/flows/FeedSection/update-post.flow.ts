import { Page, TestInfo } from '@playwright/test';
import { FeedPage } from '../../../pages/FeedSection/feed.page';
import { attachScreenshot } from '../../../utils/allureScreenshot';

export async function updatePostFlow(
  page: Page,
  testInfo: TestInfo,
) {
  const feed = new FeedPage(page);

  await page.waitForTimeout(3000);

  // 🔥 edit first post
  await feed.editFirstPost();

  // update content
  await feed.postTextarea.fill('This is my today post updated');
  await feed.updateBtn.click();
  await page.waitForTimeout(3000);
  await attachScreenshot(page, testInfo, 'post-updated');
}
