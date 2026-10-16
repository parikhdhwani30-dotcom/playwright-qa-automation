import { Page, expect } from '@playwright/test';
import SketchplayBucksPage from '../../../../pages/AdminCenter/Marketing/sketchplay-bucks.page';

/**
 * Test flow for managing Sketchplay Bucks in the Marketing section of Admin Center.
 * This function performs the following steps:
 * 1. Navigates to the Sketchplay Bucks page.
 * 2. Searches for a user by name.
 * 3. Verifies the presence of the Sketchplay Bucks entry.
 * 
 * @param {Page} page - The Playwright page object for interacting with the UI.
 * @param {any} testInfo - The test info object for attaching screenshots and logs.
 */
export async function sketchplayBucksFlow(page: Page, testInfo: any) {
  const bucksPage = new SketchplayBucksPage(page);

  // Navigate to the Sketchplay Bucks page
  await bucksPage.navigate();
  await bucksPage.clickSketchplayBucks();

  // Search for a specific user by name in the Sketchplay Bucks list
  const searchName = 'RONAK PATEL';
  await bucksPage.searchUser(searchName);
  await bucksPage.page.waitForTimeout(1500); // Wait for search results

  // Verify if the user is present in the search results
  const found = await bucksPage.verifyUserSearchColumn(searchName, testInfo);

  // Log the result of the search
  if (found) console.log(`✅ Sketchplay Bucks "${searchName}" found.`);
  else console.log(`❌ Sketchplay Bucks "${searchName}" NOT found.`);

  // Soft assertion to verify if the Sketchplay Bucks entry is found
  expect.soft(found).toBeTruthy();
}
