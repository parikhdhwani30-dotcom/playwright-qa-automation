import { Page } from '@playwright/test';
import { BasePage } from '../../baseFile';

/**
 * Page Object for managing Discount Codes within the Marketing section.
 * This class encapsulates all actions related to navigating and interacting
 * with the Discount Codes page in the Admin Center.
 */
export default class DiscountCodesPage extends BasePage {
  constructor(page: Page) {
    super(page, '/admin-center');
  }

  /**
   * Navigate to the Discount Codes module within the Admin Center.
   */
  async clickDiscountCodes() {
    await this.navigateToAnyModule('Discount Codes');
  }
}
