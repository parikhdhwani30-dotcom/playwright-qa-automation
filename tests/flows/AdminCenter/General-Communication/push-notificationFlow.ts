import { Page, expect } from '@playwright/test';
import { PushNotificationPage } from '../../../../pages/AdminCenter/General-Communication/push-notification.page';

/**
 * Test flow for managing Push Notifications in the Admin Center.
 * This function performs the following steps:
 * 1. Navigates to the Push Notification page.
 * 2. Searches for a specific user by name.
 * 3. Verifies the presence of the user in the search results.
 * 
 * @param {Page} page - The Playwright page object for interacting with the UI.
 * @param {any} testInfo - The test info object for attaching screenshots and logs.
 */
export async function pushNotificationFlow(page: Page, testInfo: any) {
  const pushPage = new PushNotificationPage(page);

  // Step 1: Visit the Admin Center page
  await pushPage.visit();

  // Step 2: Navigate to the Push Notification section
  await pushPage.navigateToPushNotification();

  // Step 3: Searching for a specific user by name
  const searchUserName = 'Test Admin';
  await pushPage.searchUser(searchUserName);

  // Step 4: Verifying if the user is found in the search results
  const found = await pushPage.verifyUserSearch(searchUserName, testInfo);

  // Log the result of the search
  if (found) {
    console.log(`✅ User "${searchUserName}" was found.`);
  } else {
    console.log(`❌ User "${searchUserName}" not found.`);
  }

  // Soft assertion to verify if the user is found
  expect.soft(found).toBeTruthy();
}
