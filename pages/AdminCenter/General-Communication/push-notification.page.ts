import test, { Page } from '@playwright/test';
import { BasePage } from '../../baseFile';

/**
 * Page Object for managing Push Notifications within the Admin Center.
 * This class encapsulates all actions related to interacting with the 
 * Push Notification page.
 */
export class PushNotificationPage extends BasePage {
  constructor(page: Page) {
    super(page, '/admin-center');
  }

  /**
   * Visit the admin-center and navigate to the base URL.
   * This method is used to visit the Admin Center page.
   */
  async visit() {
    await test.step('Visit admin-center', async () => {
      await this.page.goto(this.baseUrl);
    });
  }

  /**
   * Navigate to the 'Send Push Notification' module within the Admin Center.
   * This method will navigate the page to the Push Notification section.
   */
  async navigateToPushNotification() {
    await this.navigateToAnyModule('Send Push Notification');
  }
}
