import { Page, expect } from '@playwright/test';
import ManageTrainingSchedulePage from '../../../../pages/AdminCenter/Train-Compete/manage-training-schedule.page';

/**
 * Test flow for managing the training schedule in the Train & Compete section of Admin Center.
 * This function performs the following steps:
 * 1. Navigates to the Manage Training Schedule page.
 * 2. Selects an organization from the dropdown.
 * 3. Verifies the presence of a specific training schedule in the list.
 * 
 * @param {Page} page - The Playwright page object for interacting with the UI.
 * @param {any} testInfo - The test info object for attaching screenshots and logs.
 */
export async function manageTrainingScheduleFlow(page: Page, testInfo: any) {
  const schedulePage = new ManageTrainingSchedulePage(page);

  // Navigate to the Manage Training Schedule page
  await schedulePage.navigate();
  await schedulePage.clickManageTrainingSchedule();

  // Wait for the page to load and stabilize
  await schedulePage.page.waitForTimeout(1000);

  // Select an organization from the dropdown
  await schedulePage.selectOrganization('calendar'); // Adjust if dynamic
  await schedulePage.page.waitForTimeout(500); // Short wait after selection

  // Searching for a specific training schedule by name
  const searchName = 'Client15 child event'; 

  //Wrong value
  //const searchName = 'Cliendfsdfsdt15 child event'; 

  const found = await schedulePage.verifyUserSearch(searchName, testInfo);

  // Log the result of the search
  if (found) {
    console.log(`✅ Training Schedule "${searchName}" found.`);
  } else {
    console.log(`❌ Training Schedule "${searchName}" NOT found.`);
  }

  // Soft assertion to verify if the training schedule is found
  expect.soft(found).toBeTruthy();
}
