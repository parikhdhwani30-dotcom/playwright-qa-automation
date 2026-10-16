import { Page, expect } from '@playwright/test';
import TournamentCentralPage from '../../../../pages/AdminCenter/Train-Compete/tournament-central.page';

/**
 * Test flow for managing tournaments in the Tournament Central section of Admin Center.
 * This function performs the following steps:
 * 1. Navigates to the Tournament Central page.
 * 2. Searches for a specific tournament by name.
 * 3. Verifies the presence of the tournament entry in the results.
 * 
 * @param {Page} page - The Playwright page object for interacting with the UI.
 * @param {any} testInfo - The test info object for attaching screenshots and logs.
 */
export async function tournamentCentralFlow(page: Page, testInfo: any) {
  const tournamentPage = new TournamentCentralPage(page);

  // Navigate to the Tournament Central page
  await tournamentPage.navigate();
  await tournamentPage.clickTournamentCentral();

  // Searching for a specific tournament by name
  const searchName = 'Battle Grounds Tournament'; 
  await tournamentPage.searchUser(searchName);

  // Wait for search results to load
  await tournamentPage.page.waitForTimeout(1000);

  // Verifying if the tournament entry exists in the search results
  const found = await tournamentPage.verifyUserSearch(searchName, testInfo);

  // Log the result of the search
  if (found) {
    console.log(`✅ Tournament "${searchName}" found.`);
  } else {
    console.log(`❌ Tournament "${searchName}" NOT found.`);
  }

  // Soft assertion to verify if the tournament is found
  expect.soft(found).toBeTruthy();
}
