import { Page, TestInfo } from '@playwright/test';
import { QuickLinksPage } from '../../../pages/QuickLinks/quickLinksPage';

export async function quickLinksFlow(page: Page, testInfo: TestInfo) {
  const quickLinks = new QuickLinksPage(page);

  console.log('🚀 Starting Quick Links Verification Flow');

  await quickLinks.navigate();
  await quickLinks.verifyAllQuickLinks(testInfo);

  console.log('✅ Quick Links Verification Flow Completed');
}
