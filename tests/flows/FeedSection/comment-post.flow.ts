import { Page, TestInfo } from '@playwright/test';
import { FeedPage } from '../../../pages/FeedSection/feed.page';
import { attachScreenshot } from '../../../utils/allureScreenshot';

export async function commentPostFlow(page: Page, testInfo: TestInfo) {
  const feed = new FeedPage(page);

  await feed.addComment('Added comment on post', testInfo);
}