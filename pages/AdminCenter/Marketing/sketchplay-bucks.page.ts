import { Page } from '@playwright/test';
import { BasePage } from '../../baseFile';

/**
 * Page Object for managing Sketchplay Bucks within the Admin Center.
 * This class encapsulates all actions related to interacting with the 
 * Sketchplay Bucks page.
 */
export default class SketchplayBucksPage extends BasePage {
  constructor(page: Page) {
    super(page, '/admin-center');
  }

  /**
   * Navigate to the 'Sketchplay Bucks' module within the Admin Center.
   */
  async clickSketchplayBucks() {
    await this.navigateToAnyModule('Sketchplay Bucks');
  }
}
