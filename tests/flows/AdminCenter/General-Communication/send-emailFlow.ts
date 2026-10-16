import { Page, expect } from '@playwright/test';
import SendEmailPage from '../../../../pages/AdminCenter/General-Communication/send-email.page';

/**
 * Test flow for sending and managing emails in the Admin Center.
 * This function performs the following steps:
 * 1. Navigates to the 'Send & Manage Email' page.
 * 2. Selects a specific organization.
 * 3. Searches for a user by name.
 * 4. Verifies the presence of the user in the list.
 * 
 * @param {Page} page - The Playwright page object for interacting with the UI.
 * @param {any} testInfo - The test info object for attaching screenshots and logs.
 */
export async function sendEmailFlow(page: Page, testInfo: any) {
  const emailPage = new SendEmailPage(page);

  // Step 1: Navigate to the Send & Manage Email page
  await emailPage.navigate();
  await emailPage.clickSendAndManageEmail();

  // Step 2: Select the organization 'ClientNEw777'
  await emailPage.selectOrganization('ClientNEw777');
  await emailPage.page.waitForTimeout(500);

  // Step 3: Searching for a specific client by name
  const searchClientName = 'asdf';
  await emailPage.searchUser(searchClientName);

  // Step 4: Verifying if the client is found in the list
  const clientFound = await emailPage.verifyUserSearch(searchClientName, testInfo);

  // Log the result of the search
  if (clientFound) {
    console.log(`✅ Client "${searchClientName}" is visible in SMS list`);
  } else {
    console.log(`❌ Client "${searchClientName}" is NOT visible in SMS list`);
  }

  // Soft assertion to verify if the client is found
  expect.soft(clientFound).toBeTruthy();
}
