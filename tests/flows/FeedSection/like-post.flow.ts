import { Page, TestInfo } from '@playwright/test';
import { FeedPage } from '../../../pages/FeedSection/feed.page';
import { attachScreenshot } from '../../../utils/allureScreenshot';

export async function likePostFlow(page: Page, testInfo: TestInfo) {
  const feed = new FeedPage(page);

   await page.waitForTimeout(1000);
    await feed.likeBtn.first().click();
  await attachScreenshot(page, testInfo, 'liked-post');
}
