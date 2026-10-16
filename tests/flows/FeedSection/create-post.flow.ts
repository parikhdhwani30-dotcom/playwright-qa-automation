import { Page, TestInfo, expect } from '@playwright/test';
import { FeedPage } from '../../../pages/FeedSection/feed.page';
import { attachScreenshot } from '../../../utils/allureScreenshot';

import path from 'path';

export async function createPostFlow(page: Page, testInfo: TestInfo) {
  const feed = new FeedPage(page);

  // 1️⃣ Navigate and wait for dashboard to be fully loaded
  await feed.navigate();
  await page.waitForLoadState('networkidle');

  // Optional: wait for any main dashboard element
  await expect(feed.feedNavBtn).toBeVisible();

  // 2️⃣ Click Feed navigation
  await feed.feedNavBtn.click();
  await page.waitForLoadState('networkidle');

  // 3️⃣ Click Community
  await expect(feed.communityName).toBeVisible();
  await feed.communityName.click();
  await page.waitForLoadState('networkidle');

  // 4️⃣ Open Create Post editor

  await feed.openPostEditor();

  // Wait for post editor UI
  await expect(feed.postTextarea).toBeVisible();
  await feed.postTextarea.fill('This is my today\'s post');

  // 5️⃣ Upload image
  const imagePath = path.resolve('files/download.jpg');
  await feed.uploadPhoto(imagePath);

  // Wait until image upload finishes (spinner/progress disappears)
  await page.waitForTimeout(1000);

  // 6️⃣ Upload document
  const docPath = path.resolve('files/UpdatedConfidentialityAgreement.pdf');
  await feed.uploadDocument(docPath);

  // Wait until document upload finishes
  await page.waitForTimeout(3000);

  // 8️⃣ Click Post
  await feed.postBtn.click();

  await page.waitForTimeout(2500);

  await attachScreenshot(page, testInfo, 'post-created');

}
