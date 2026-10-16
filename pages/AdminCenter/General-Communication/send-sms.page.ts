import { Page } from '@playwright/test';
import { BasePage } from '../../baseFile';

/**
 * Page Object for sending and managing SMS within the Admin Center.
 * This class encapsulates all actions related to interacting with the 
 * Send SMS page.
 */
export default class SendSmsPage extends BasePage {
  constructor(page: Page) {
    super(page, '/admin-center');
  }

  /**
   * Navigate to the 'Send & Manage SMS' module within the Admin Center.
   * This method is used to navigate the page to the SMS management section.
   */
  async clickSendAndManageSMS() {
    await this.navigateToAnyModule('Send & Manage SMS');
  }

  /**
   * Select an organization from the dropdown.
   * It opens the dropdown and selects the organization passed as a parameter.
   * 
   * @param {string} orgName - The name of the organization to select.
   */
  async selectOrganization(orgName: string) {
    // Click to open the organization dropdown
    await this.page.locator('#smsOrg div').first().click();

    // Select the organization by name
    await this.page.getByRole('option', { name: orgName }).click();
  }
}
