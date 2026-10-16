import { Page, expect } from '@playwright/test';
import DiscountCodesPage from '../../../../pages/AdminCenter/Marketing/discount-codes.page';
import path from 'path';

/**
 * Test flow for verifying discount codes in the Marketing section
 * This function ensures that the discount codes are being listed and verifies
 * the presence of a specific discount code under the specified organization.
 * 
 * @param {Page} page - The Playwright page object for interaction
 * @param {any} testInfo - The test info object to attach screenshots and logs
 */
export async function discountCodesFlow(page: Page, testInfo: any) {
  const discountPage = new DiscountCodesPage(page);

  // Navigate to the Discount Codes section in the Marketing module
  await discountPage.navigate();
  await discountPage.clickDiscountCodes();

  // Select the organization for filtering
  await discountPage.selectOrganization('calendar');

  // Searching for a specific discount code in the list
  const searchName = 'All Org Discount List';
  const found = await discountPage.verifyUserSearchColumn(searchName, testInfo);

  // Log and assert the presence of the discount code
  if (found) {
    console.log(`✅ Discount Code "${searchName}" found in the list.`);
  } else {
    console.log(`❌ Discount Code "${searchName}" NOT found in the list.`);
  }

  // Soft assertion to verify if the discount code is found
  expect.soft(found).toBeTruthy();
}
