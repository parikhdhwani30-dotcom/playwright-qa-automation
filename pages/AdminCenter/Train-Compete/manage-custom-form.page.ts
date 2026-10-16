import { Page } from '@playwright/test';
import { BasePage } from '../../baseFile';

/**
 * Page Object for managing Custom Forms within the Admin Center.
 * This class encapsulates all actions related to interacting with the 
 * Manage Custom Form page.
 */
export default class ManageCustomFormPage extends BasePage {
  constructor(page: Page) {
    super(page, '/admin-center');
  }

  /**
   * Navigate to the 'Manage Custom Form' module within the Admin Center.
   */
  async clickManageCustomForm() {
    await this.navigateToAnyModule('Manage Custom Form');
  }
}
