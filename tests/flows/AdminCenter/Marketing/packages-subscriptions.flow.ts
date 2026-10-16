import { Page, expect } from '@playwright/test';
import PackagesSubscriptionsPage from '../../../../pages/AdminCenter/Marketing/packages-subscriptions.page';

/**
 * Test flow for managing packages and subscriptions in the Marketing section of Admin Center.
 * This function performs the following steps:
 * 1. Navigates to the Packages & Subscriptions page.
 * 2. Selects an organization for filtering.
 * 3. Verifies the presence of a specific package or subscription in the list.
 * 
 * @param {Page} page - The Playwright page object for interacting with the UI.
 * @param {any} testInfo - The test info object for attaching screenshots and logs.
 */
export async function packagesSubscriptionsFlow(page: Page, testInfo: any) {
  const packagePage = new PackagesSubscriptionsPage(page);

  // Navigate to the Packages & Subscriptions page
  await packagePage.navigate();
  await packagePage.clickPackagesSubscriptions();

  // Select the organization for filtering
  await packagePage.selectOrganization('calendar');

  // Searching for a specific package/subscription in the list
  const searchName = 'Expiration Date';
  const found = await packagePage.verifyUserSearchColumn(searchName, testInfo);

  // Log the result of the search
  if (found) console.log(`✅ Package/Subscription "${searchName}" found.`);
  else console.log(`❌ Package/Subscription "${searchName}" NOT found.`);

  // Soft assertion to verify if the package/subscription is found
  expect.soft(found).toBeTruthy();
}
