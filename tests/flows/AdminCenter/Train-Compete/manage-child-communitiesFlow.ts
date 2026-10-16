import { Page, expect } from '@playwright/test';
import ManageChildCommunitiesPage from '../../../../pages/AdminCenter/Train-Compete/manage-child-communities.page';

/**
 * Test flow for managing child communities in the Train & Compete section of Admin Center.
 * This function performs the following steps:
 * 1. Navigates to the Manage Child Communities page.
 * 2. Searches for a specific child community by name.
 * 3. Verifies the presence of the child community entry in the results.
 * 
 * @param {Page} page - The Playwright page object for interacting with the UI.
 * @param {any} testInfo - The test info object for attaching screenshots and logs.
 */
export async function manageChildCommunitiesFlow(page: Page, testInfo: any) {
  const childPage = new ManageChildCommunitiesPage(page);

  // Navigate to the Manage Child Communities page
  await childPage.navigate();
  await childPage.clickManageChildCommunities();

  // Searching for a specific child community by name
  const searchName = 'Child Free';
  await childPage.searchUser(searchName);

  // Verifying if the child community entry exists in the search results
  const found = await childPage.verifyUserSearch(searchName, testInfo);

  // Log the result of the search
  if (found) {
    console.log(`✅ Child Community "${searchName}" found.`);
  } else {
    console.log(`❌ Child Community "${searchName}" NOT found.`);
  }

  // Soft assertion to verify if the child community is found
  expect.soft(found).toBeTruthy();
}
