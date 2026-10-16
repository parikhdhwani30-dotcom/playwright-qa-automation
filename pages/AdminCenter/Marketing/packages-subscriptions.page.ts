import { Page } from '@playwright/test';
import { BasePage } from '../../baseFile';

/**
 * Page Object for managing Packages & Subscriptions within the Admin Center.
 * This class encapsulates all actions related to interacting with the 
 * Packages & Subscriptions page.
 */
export default class PackagesSubscriptionsPage extends BasePage {
  constructor(page: Page) {
    super(page, '/admin-center');
  }

  /**
   * Navigate to the 'Packages & Subscriptions' module within the Admin Center.
   */
  async clickPackagesSubscriptions() {
    await this.navigateToAnyModule('Packages & Subscriptions');
  }
}
