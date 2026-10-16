import { Page, expect } from '@playwright/test';
import ManageUserPage from '../../../../pages/AdminCenter/General-Communication/manage-user.page';

/**
 * Test flow for managing users in the Admin Center.
 * This function performs the following steps:
 * 1. Navigates to the Admin Center and accesses the 'Manage Users' module.
 * 2. Searches for a specific user by name.
 * 3. Verifies the presence of the user in the search results.
 * 
 * @param {Page} page - The Playwright page object for interacting with the UI.
 * @param {any} testInfo - The test info object for attaching screenshots and logs.
 */
export async function manageUserFlow(page: Page, testInfo: any) {
  const manageUserPage = new ManageUserPage(page);

  // Navigate to the Admin Center
  await manageUserPage.visit();

  // Click on the 'Manage Users' module
  await manageUserPage.clickManageUsers();

  // Searching for a specific user by name
  const searchUserName = 'Test Admin';
  await manageUserPage.searchUser(searchUserName);

  // Verify if the user exists in the search results
  const userFound = await manageUserPage.verifyUserSearch(searchUserName, testInfo);

  // Log the result of the search
  if (userFound) {
    console.log(`✅ User "${searchUserName}" was found.`);
  } else {
    console.log(`❌ User "${searchUserName}" not found.`);
  }

  // Soft assertion to verify if the user is found
  expect.soft(userFound).toBeTruthy();
}
