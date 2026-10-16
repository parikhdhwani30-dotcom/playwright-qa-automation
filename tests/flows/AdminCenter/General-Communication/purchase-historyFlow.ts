import test, { Page, expect } from '@playwright/test';
import PurchaseHistoryPage from '../../../../pages/AdminCenter/General-Communication/purchase-history.page';

// Set a timeout for this test (2 minutes)
test.setTimeout(120000); // 2 min timeout

/**
 * Test flow for managing purchase history in the Admin Center.
 * This function performs the following steps:
 * 1. Navigates to the Purchase History page.
 * 2. Loops through the list of tabs and performs searches.
 * 3. Verifies the presence of the search results.
 * 4. Exports tab data after performing the searches.
 * 
 * @param {Page} page - The Playwright page object for interacting with the UI.
 * @param {any} testInfo - The test info object for attaching screenshots and logs.
 */
export async function purchaseHistoryFlow(page: Page, testInfo: any) {
  const purchasePage = new PurchaseHistoryPage(page);

  // Navigate to the Purchase History page
  await purchasePage.visit();
  await purchasePage.clickPurchaseHistory();

  // List of tabs & search values to test
  const searches = [
    { tab: 'Packages', value: 'Sub - 15 pack' },
    { tab: 'Single Events', value: 'Stripe - Main Event' },
    { tab: 'Event Payment Plans', value: 'New Event' },
    { tab: 'Subscriptions', value: 'ND sub' },
    { tab: 'Package Payment Plans', value: 'Package Trial 15 pack' },
    { tab: 'Package Subscriptions', value: 'Sub - 15 pack' },
  ];

  //Invalid Records

  // const searches = [
  //   { tab: 'Packages', value: 'Sub - 15 pasdfsdfck' },
  //   { tab: 'Single Events', value: 'Stripe - Main Evsdfsdfent' },
  //   { tab: 'Event Payment Plans', value: 'New Evensdfsdft' },
  //   { tab: 'Subscriptions', value: 'ND susdfsdfb' },
  //   { tab: 'Package Payment Plans', value: 'Package Trial 1sdfsdf5 pack' },
  //   { tab: 'Package Subscriptions', value: 'Sub - 15 psdfsdfack' },
  // ];

  
  // Loop through each tab search and perform verification
  for (const item of searches) {
    // Click the tab if it's not 'Packages'
    if (item.tab !== 'Packages') {
      await purchasePage.page.getByRole('link', { name: item.tab, exact: true }).click();
    }

    // Search for the value in the current tab
    await purchasePage.searchUser(item.value);
    const found = await purchasePage.verifyUserSearchColumn(item.value, testInfo);

    // Soft assertion to check if the search was successful
    expect.soft(found, `❌ Search failed for: ${item.value}`).toBeTruthy();
  }

  // Export tab data after performing the searches
  const download = await purchasePage.exportTabData();
  if (download) {
    const suggestedName = download.suggestedFilename();
    await download.saveAs(`downloads/${suggestedName}`);
    console.log('✅ Export triggered:', suggestedName);
  }
}
