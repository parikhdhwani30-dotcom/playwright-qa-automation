import { Page } from '@playwright/test';
import { BasePage } from '../../baseFile';

/**
 * Page Object for managing the Tournament Central within the Admin Center.
 * This class encapsulates all actions related to interacting with the 
 * Tournament Central page.
 */
export default class TournamentCentralPage extends BasePage {
  constructor(page: Page) {
    super(page, '/admin-center');
  }

  /**
   * Navigate to the 'Tournament Central' module within the Admin Center.
   */
  async clickTournamentCentral() {
    await this.navigateToAnyModule('Tournament Central');
  }
}
