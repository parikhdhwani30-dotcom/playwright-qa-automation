import { Page, expect } from '@playwright/test';
import SendSmsPage from '../../../../pages/AdminCenter/General-Communication/send-sms.page';

/**
 * Test flow for sending and managing SMS in the Admin Center.
 * This function performs the following steps:
 * 1. Navigates to the 'Send & Manage SMS' page.
 * 2. Selects a specific organization.
 * 3. Searches for a client by name.
 * 4. Verifies the presence of the client in the SMS list.
 * 
 * @param {Page} page - The Playwright page object for interacting with the UI.
 * @param {any} testInfo - The test info object for attaching screenshots and logs.
 */
export async function sendSmsFlow(page: Page, testInfo: any) {
  const smsPage = new SendSmsPage(page);

  // Step 1: Navigate to the 'Send & Manage SMS' page
  await smsPage.navigate();
  await smsPage.clickSendAndManageSMS();

  // Step 2: Select the organization 'ClientNEw777'
  await smsPage.selectOrganization('ClientNEw777');
  await smsPage.page.waitForTimeout(500); // Short wait after organization selection

  // Step 3: Searching for a specific client by name
  const searchClientName = 'Client';
  await smsPage.searchUser(searchClientName);

  // Step 4: Verifying if the client is found in the SMS list
  const clientFound = await smsPage.verifyUserSearch(searchClientName, testInfo);

  // Log the result of the search
  if (clientFound) {
    console.log(`✅ Client "${searchClientName}" is visible in SMS list`);
  } else {
    console.log(`❌ Client "${searchClientName}" is NOT visible in SMS list`);
  }

  // Soft assertion to verify if the client is found
  expect.soft(clientFound).toBeTruthy();
}
