import { Page, expect } from '@playwright/test';
import ManagePaymentPlansPage from '../../../../pages/AdminCenter/Marketing/manage-payment-plans.page';

/**
 * Test flow for managing payment plans in the Marketing section of Admin Center.
 * This function performs the following steps:
 * 1. Navigates to the Manage Payment Plans page.
 * 2. Selects an organization.
 * 3. Verifies the presence of a specific payment plan in the list.
 * 
 * @param {Page} page - The Playwright page object for interacting with the UI.
 * @param {any} testInfo - The test info object for attaching screenshots and logs.
 */
export async function managePaymentPlansFlow(page: Page, testInfo: any) {
  const planPage = new ManagePaymentPlansPage(page);

  // Navigate to the Manage Payment Plans page
  await planPage.navigate();
  await planPage.clickManagePaymentPlans();

  // Select the organization for filtering
  await planPage.selectOrganization('calendar');

  // Searching for a specific payment plan in the list
  const searchName = 'any Set-cookie: Tamper=598a6f9a-840c-417a-b9c4-a190f22010db';
  const found = await planPage.verifyUserSearchColumn(searchName, testInfo);

  // Log the result of the search
  if (found) console.log(`✅ Payment Plan "${searchName}" found.`);
  else console.log(`❌ Payment Plan "${searchName}" NOT found.`);

  // Soft assertion to verify if the payment plan is found
  expect.soft(found).toBeTruthy();
}
