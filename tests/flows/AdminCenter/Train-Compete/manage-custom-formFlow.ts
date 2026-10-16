import { Page, expect } from '@playwright/test';
import ManageCustomFormPage from '../../../../pages/AdminCenter/Train-Compete/manage-custom-form.page';

/**
 * Test flow for managing custom forms in the Train & Compete section of Admin Center.
 * This function performs the following steps:
 * 1. Navigates to the Manage Custom Form page.
 * 2. Searches for a specific custom form by name.
 * 3. Verifies the presence of the custom form entry in the results.
 * 
 * @param {Page} page - The Playwright page object for interacting with the UI.
 * @param {any} testInfo - The test info object for attaching screenshots and logs.
 */
export async function manageCustomFormFlow(page: Page, testInfo: any) {
  const formPage = new ManageCustomFormPage(page);

  // Navigate to the Manage Custom Form page
  await formPage.navigate();
  await formPage.clickManageCustomForm();

  // Searching for a specific Manage Custom Form by name
  const searchName = 'New Custome999'; 
  await formPage.searchUser(searchName);

  // Wait for search results to load
  await formPage.page.waitForTimeout(1000);

  // Verifying if the Manage Custom Form entry exists in the search results
  const found = await formPage.verifyUserSearch(searchName, testInfo);

  // Log the result of the search
  if (found) {
    console.log(`✅ Manage Custom Form "${searchName}" found.`);
  } else {
    console.log(`❌ Manage Custom Form "${searchName}" NOT found.`);
  }

  // Soft assertion to verify if the Manage Custom Form is found
  expect.soft(found).toBeTruthy();
}
