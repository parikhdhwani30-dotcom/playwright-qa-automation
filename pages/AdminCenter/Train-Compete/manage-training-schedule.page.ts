import { Page } from '@playwright/test';
import { BasePage } from '../../baseFile';

/**
 * Page Object for managing the Training Schedule within the Admin Center.
 * This class encapsulates all actions related to interacting with the 
 * Manage Training Schedule page.
 */
export default class ManageTrainingSchedulePage extends BasePage {
  constructor(page: Page) {
    super(page, '/admin-center');
  }

  /**
   * Navigate to the 'Manage Training Schedule' module within the Admin Center.
   */
  async clickManageTrainingSchedule() {
    await this.navigateToAnyModule('Manage Training Schedule');
  }

  /**
   * Select an organization from the organization dropdown.
   * It types a filter and clicks on the desired option.
   * 
   * @param orgName - The name of the organization to select
   */
  async selectOrganization(orgName: string) {
    // Open the dropdown for organizations
    await this.page.locator('.ng-select-container').click();

    // Type the organization name in the filter input
    const filterInput = this.page.locator('.ng-input input');
    await filterInput.fill(orgName.substring(0, 3)); // Example: "ca"

    // Wait for the dropdown options to appear and become visible
    const option = this.page.locator('.ng-option span', { hasText: orgName });
    await option.first().waitFor({ state: 'visible', timeout: 10000 });

    // Click the option that matches the organization name
    await option.first().click();
  }
}
