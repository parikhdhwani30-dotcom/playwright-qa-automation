import { Page } from '@playwright/test';
import { BasePage } from '../../baseFile';

/**
 * Page Object for managing Child Communities within the Admin Center.
 * This class encapsulates all actions related to interacting with the 
 * Manage Child Communities page.
 */
export default class ManageChildCommunitiesPage extends BasePage {
  constructor(page: Page) {
    super(page, '/admin-center');
  }

  /**
   * Navigate to the 'Manage Child Communities' module within the Admin Center.
   */
  async clickManageChildCommunities() {
    await this.navigateToAnyModule('Manage Child Communities');
  }
}
