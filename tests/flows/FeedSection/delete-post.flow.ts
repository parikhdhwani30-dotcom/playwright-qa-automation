import { Page, TestInfo } from '@playwright/test';
import { FeedPage } from '../../../pages/FeedSection/feed.page';


export async function deletePostFlow(page: Page, testInfo: TestInfo) {
  const feed = new FeedPage(page);

   await page.waitForTimeout(1000);
  await feed.deleteFirstPost(testInfo); // Pass testInfo here
 
}
