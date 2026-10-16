import { Page } from '@playwright/test';
import { BasePage } from '../../baseFile';

/**
 * Page Object for managing Payment Plans within the Admin Center.
 * This class encapsulates all actions related to interacting with the 
 * Manage Payment Plans page.
 */
export default class ManagePaymentPlansPage extends BasePage {
  constructor(page: Page) {
    super(page, '/admin-center');
  }

  /**
   * Navigate to the 'Manage Payment Plans' module within the Admin Center.
   */
  async clickManagePaymentPlans() {
    await this.navigateToAnyModule('Manage Payment Plans');
  }
}
