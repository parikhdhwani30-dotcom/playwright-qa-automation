import test, { Locator, Page } from '@playwright/test';
import { BasePage } from '../../baseFile';

/**
 * Page Object for managing Purchase History within the Admin Center.
 * This class encapsulates all actions related to interacting with the 
 * Purchase History page.
 */
export default class PurchaseHistoryPage extends BasePage {
  readonly exportTabDataBtn: Locator;

  constructor(page: Page) {
    super(page, '/admin-center');
    this.exportTabDataBtn = page.getByText('Export Tab Data');
  }

  /**
   * Visit the Admin Center and navigate to the base URL.
   * This method is used to navigate to the Admin Center.
   */
  async visit() {
    await test.step('Visit Admin Center', async () => {
      await this.page.goto(this.baseUrl);
    });
  }

  /**
   * Export the tab data by clicking the 'Export Tab Data' button.
   * It waits for the download event and returns the download object.
   */
  async exportTabData() {
    return await test.step('Export Tab Data', async () => {
      const downloadPromise = this.page.waitForEvent('download');
      await this.exportTabDataBtn.click();
      return await downloadPromise;
    });
  }

  /**
   * Navigate to the 'Manage Purchase History' module within the Admin Center.
   * @param nthIndex - The index of the module (default is 4).
   */
  async clickPurchaseHistory() {
    await this.navigateToAnyModule('Manage Purchase History', 4);
  }
}
