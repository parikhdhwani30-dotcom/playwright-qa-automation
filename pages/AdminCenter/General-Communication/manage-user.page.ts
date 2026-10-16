import test, { Page } from '@playwright/test';
import { BasePage } from '../../baseFile';

/**
 * Page Object for managing users within the Admin Center.
 * This class encapsulates all actions related to interacting with the 
 * Manage Users page.
 */
export default class ManageUserPage extends BasePage {
  constructor(page: Page) {
    super(page, '/admin-center');
  }

  /**
   * Visit the Admin Center page.
   * This method is used to navigate to the base URL of the Admin Center.
   */
  async visit() {
    await test.step('Visit Admin Center', async () => {
      await this.page.goto(this.baseUrl);
    });
  }

  /**
   * Navigate to the 'Manage Users' module within the Admin Center.
   */
  async clickManageUsers() {
    await this.navigateToAnyModule('Manage Users');
  }
}
