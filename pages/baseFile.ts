import { expect, Locator, Page, test, TestInfo } from '@playwright/test';

/**
 * Base class providing common actions and methods for navigating
 * and interacting with elements across different pages in the application.
 */
export class BasePage {
  readonly page: Page;
  readonly baseUrl: string;

  // Common Locators
  readonly spinner: Locator;
  readonly searchBox: Locator;
  readonly tapAnywherePopup: Locator;

  constructor(page: Page, baseUrl: string = '/sketchplay-dashboard') {
    this.page = page;
    this.baseUrl = baseUrl;
    this.spinner = page.locator('.spinner, [role="progressbar"], .loading, .backdrop-blur-sm, div.fixed[style*="z-index: 10000"], div.fixed.z-\\[10000\\]');
    this.searchBox = page.getByRole('textbox', { name: 'Search...' });
    this.tapAnywherePopup = page.getByText(/Tap anywhere to continue|Click anywhere to continue/i);
  }

  /**
   * Helper to clear lingering confirmation popups if they appear.
   * This uses isVisible() to avoid pausing the debugger on timeouts.
   */
  async tapAnywhereIfVisible() {
    try {
      // Wait a moment for the popup to potentially render
      await this.page.waitForTimeout(1000);

      // Wait up to 3 seconds for it to become visible (does not throw if it fails)
      await this.tapAnywherePopup.waitFor({ state: 'visible', timeout: 3000 }).catch(() => { });

      if (await this.tapAnywherePopup.isVisible()) {
        await this.tapAnywherePopup.click({ force: true });
        await this.page.waitForTimeout(500);
        console.log("✅ Confirmation popup cleared.");
      }
    } catch {
      // Safely skip if not present
    }
  }

  /**
   * Navigate to the base URL.
   */
  async navigate() {
    await this.page.goto(this.baseUrl);
  }

  async waitForSpinner() {
    // Wait for any potential spinners or backdrop overlays to disappear
    await this.spinner.last().waitFor({ state: 'hidden', timeout: 15000 }).catch(() => { });
  }

  /**
   * Navigate to the Admin Center from any page.
   */

  async navigateToAdminCenter() {
    await test.step('Navigate to Admin Center (Stable Fix)', async () => {

      // 1. Go to dashboard
      await this.page.goto('/sketchplay-dashboard');
      await this.page.waitForLoadState('domcontentloaded');
      await this.page.waitForLoadState('networkidle');

      // Angular extra rendering time
      await this.page.waitForTimeout(5000);

      // 2. Locate Admin Center card (more reliable)
      const adminCard = this.page.locator('div.cursor-pointer:has-text("Admin Center")').first();

      await adminCard.waitFor({ state: 'visible', timeout: 30000 });
      await adminCard.scrollIntoViewIfNeeded();

      console.log('🖱️ Clicking Admin Center...');

      // 3. Click with wait for DOM change (NOT URL)
      await Promise.all([
        this.page.waitForSelector('app-admin-center', { timeout: 20000 }), // ✅ IMPORTANT
        adminCard.click()
      ]);

      console.log('✅ Successfully navigated to Admin Center');
    });
  }

  async navigateToAdmin(moduleName: string) {
    await test.step(`Navigate to ${moduleName}`, async () => {
      await this.page.waitForTimeout(2000);
      await this.waitForSpinner();
      const regex = new RegExp(moduleName.trim().replace(/\s+/g, '\\s*'), 'i');
      const moduleCard = this.page
        .locator('app-admin-center div[id*="-item-"], app-admin-center div.cursor-pointer')
        .filter({ hasText: regex, visible: true })
        .first();

      await moduleCard.waitFor({ state: 'visible', timeout: 20000 });
      await moduleCard.scrollIntoViewIfNeeded();

      console.log(`🖱️ Clicking module: ${moduleName}`);
      await moduleCard.click({ force: true });

      await this.page.waitForLoadState('domcontentloaded');
      await this.waitForSpinner();
      await this.page.waitForTimeout(2000);
    });
  }


  async clickQuickLink(name: string) {
    await this.page.waitForTimeout(2000);
    await this.waitForSpinner();
    const card = this.page
      .locator('div[id*="-item-"], div.cursor-pointer')
      .filter({ hasText: new RegExp(`^${name}$`, 'i') })
      .first();

    await card.waitFor({ state: 'visible', timeout: 10000 });
    await card.scrollIntoViewIfNeeded();
    await card.click({ force: true });

    await this.page.waitForLoadState('domcontentloaded');
    await this.waitForSpinner();

    // Click Tournament Central submodule if it appears on dashboard
    const subModule = this.page.locator('app-admin-center div').filter({ hasText: /Tournament Central/i }).first();
    if (await subModule.isVisible({ timeout: 5000 }).catch(() => false)) {
      await subModule.click({ force: true });
    }

    await this.page.waitForLoadState('domcontentloaded');
    await this.waitForSpinner();
    await this.page.waitForTimeout(2000);
  }


  /**
   * Navigate to a specific module in the Admin Center by name.
   * Optionally allows specifying the index of the module.
   * 
   * @param moduleName - The name of the module to navigate to
   * @param nthIndex - The index of the module (default is 4)
   */
  async navigateToModule(moduleName: string, nthIndex = 4) {
    await test.step(`Navigate to ${moduleName}`, async () => {
      await this.page.waitForTimeout(2000);
      await this.waitForSpinner();
      await this.page
        .locator('app-admin-center div')
        .filter({ hasText: moduleName })
        .nth(nthIndex)
        .click({ force: true });

      await this.page.waitForLoadState('domcontentloaded');
      await this.page.waitForTimeout(2000);
    });
  }

  /**
   * Navigate to any module based on a partial or full name match.
   * 
   * @param moduleName - The name of the module to navigate to
   */
  async navigateToAnyModule(moduleName: string) {
    await test.step(`Navigate to ${moduleName}`, async () => {
      // 1. Wait for Admin Center to stabilize before finding cards
      await this.page.waitForTimeout(2000);
      await this.waitForSpinner();

      // Regex that allows for any number of spaces/newlines between words
      const regex = new RegExp(moduleName.trim().split(/\s+/).join('[\\s\\n]+'), 'i');

      // Find the card. We filter for visible: true to avoid hidden elements
      const card = this.page.locator('div[id*="-item-"], div.cursor-pointer')
        .filter({ hasText: regex, visible: true })
        .first();

      // Wait for the element to be visible before clicking
      await card.waitFor({ state: 'visible', timeout: 15000 });
      await card.scrollIntoViewIfNeeded();

      console.log(`🖱️ Clicking module: ${moduleName}`);
      await card.click({ force: true });

      // 2. Wait for basic load and spinners
      await this.page.waitForLoadState('domcontentloaded');
      await this.waitForSpinner();

      // 3. Extra settle time for internal module rendering
      await this.page.waitForTimeout(2000);
      await this.page.waitForLoadState('networkidle').catch(() => { });

      console.log(`✅ Module ${moduleName} opened`);
    });
  }

  /**
   * Select an organization from the organization dropdown.
   * 
   * @param orgName - The name of the organization to select
   */
  async selectOrganization(orgName: string) {
    await test.step(`Select organization: ${orgName}`, async () => {
      await this.waitForSpinner();
      const dropdown = this.page
        .locator('div')
        .filter({ hasText: /^Filter by organization$/ })
        .first()
        .locator('.ng-select-container');

      await dropdown.click();

      const filterInput = this.page.locator('.ng-input input').first();
      await filterInput.fill(orgName.substring(0, 3));

      const option = this.page.locator('.ng-option span', { hasText: orgName });
      await option.first().waitFor({ state: 'visible', timeout: 10000 });

      await option.first().click();
    });
  }

  async selectTournamentOrganization(orgName: string) {
    await test.step(`Select organization: ${orgName}`, async () => {
      await this.waitForSpinner();
      // Locate the "Select organization" dropdown correctly even when it shows a preselected value
      const dropdown = this.page
        .locator('div')
        .filter({ hasText: /^Select organization×/ }) // Match any org name after "×"
        .first()
        .locator('.ng-select-container');

      await dropdown.click();

      // Wait for dropdown input to appear
      const filterInput = this.page.locator('.ng-input input').first();
      await expect(filterInput).toBeVisible({ timeout: 10000 });
      await filterInput.fill(orgName.substring(0, 3)); // partial text search

      // Wait for options to load and locate matching one
      const option = this.page.locator('.ng-option', { hasText: orgName }).last();

      await expect(option).toBeVisible({ timeout: 10000 });
      await option.click();

      console.log(`✅ Selected tournament organization: ${orgName}`);
    });
  }

  /**
   * Search for a user by their name.
   * 
   * @param userName - The name of the user to search for
   */
  async searchUser(userName: string) {
    await this.searchBox.waitFor({ state: 'visible', timeout: 10000 });
    await this.searchBox.fill(userName);
    await this.searchBox.press('Enter');
    await this.waitForSpinner();
  }

  /**
   * Verify the search result for a user by checking if the user is found.
   * 
   * @param userName - The name of the user to verify
   * @param testInfo - The test information for attaching screenshots
   * @returns - True if the user is found, false otherwise
   */
  async verifyUserSearch(userName: string, testInfo: any): Promise<boolean> {
    const userCell = this.page.getByRole('cell', { name: userName });
    try {
      await userCell.waitFor({ state: 'visible', timeout: 5000 });
      console.log(`✅ User "${userName}" FOUND`);
      if (testInfo) {
        await this.takeScreenshot(testInfo, `${userName}-found.png`);
      }
      return true;
    } catch {
      console.error(`❌ User "${userName}" NOT FOUND`);
      if (testInfo) {
        await this.takeScreenshot(testInfo, `${userName}-not-found.png`);
      }
      return false;
    }
  }

  /**
   * Verify if a user exists in the search result column.
   * 
   * @param userName - The name of the user to verify
   * @param testInfo - The test information for attaching screenshots
   * @returns - True if the user is found, false otherwise
   */
  async verifyUserSearchColumn(userName: string, testInfo: any): Promise<boolean> {
    const userCells = this.page.getByRole('cell', { name: userName });

    try {
      await expect(userCells.first()).toBeVisible({ timeout: 10000 });

      const count = await userCells.count();
      console.log(`✅ User "${userName}" FOUND in ${count} cell(s)`);

      if (testInfo) {
        await this.takeScreenshot(testInfo, `${userName}-found.png`);
      }
      return true;
    } catch {
      console.error(`❌ User "${userName}" NOT FOUND`);
      if (testInfo) {
        await this.takeScreenshot(testInfo, `${userName}-not-found.png`);
      }
      return false;
    }
  }

  protected async takeScreenshot(
    testInfo: TestInfo,
    name: string,
    page: Page = this.page // default to this.page if not passed
  ) {
    await testInfo.attach(name, {
      body: await page.screenshot(),
      contentType: "image/png",
    });
  }


  /**
   * Select a dropdown option by index.
   * 
   * @param dropdownLocator - The locator for the dropdown
   * @param index - The index of the option to select
   */
  async selectNgDropdownByIndex(dropdownLocator: string | Locator, index: number) {
    const dropdown = typeof dropdownLocator === 'string'
      ? this.page.locator(dropdownLocator)
      : dropdownLocator;

    await dropdown.click();
    const options = this.page.locator('.ng-option');
    await options.first().waitFor({ state: 'visible', timeout: 6500 });
    await options.nth(index).click();
  }


  async selectTournamentDates() {
    const today = new Date();
    const startDate = today;
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + 6);

    const startLabel = this.formatDateLabel(startDate);
    const endLabel = this.formatDateLabel(endDate);

    const openCalendar = this.page.locator('input[name="tournamentDates"]');

    // 🔹 Clear existing value before picking new dates
    await openCalendar.click();

    await openCalendar.press("Control+A"); await openCalendar.press("Delete");

    // Re-open calendar if it closed after clear
    await openCalendar.click();

    // 🔹 Pick new start & end dates
    await this.page.locator(`.flatpickr-day[aria-label="${startLabel}"]:visible`).click();
    await this.page.locator(`.flatpickr-day[aria-label="${endLabel}"]:visible`).click();
  }


  // Method to select open/close dates
  async pickOpenCloseDates(
    openHour = "10",
    openMinute = "00",
    closeHour = "18",
    closeMinute = "00"
  ) {
    const today = new Date();
    const openDate = new Date(today);
    openDate.setDate(today.getDate() - 1);

    const closeDate = new Date(today);
    closeDate.setDate(today.getDate() + 6);

    // const openLabel = this.formatDateLabel(today);
    const closeLabel = this.formatDateLabel(closeDate);
    const openLabel = this.formatDateLabel(openDate);

    // --- Open Date & Time ---
    const openDateInput = this.page.getByRole("textbox", { name: "Choose Open Date" });
    await openDateInput.click();
    await this.page.locator(`.flatpickr-day[aria-label="${openLabel}"]:visible`).click();

    const openTimeInput = this.page.getByRole("textbox", { name: "Open Time" });
    await openTimeInput.click();
    await this.page.getByRole("spinbutton", { name: "Hour" }).fill(openHour);
    await this.page.getByRole("spinbutton", { name: "Minute" }).fill(openMinute);

    // --- Close Date & Time ---
    const closeDateInput = this.page.getByRole("textbox", { name: "Choose Close Date" });
    await closeDateInput.click();
    await this.page.locator(`.flatpickr-day[aria-label="${closeLabel}"]:visible`).click();

    const closeTimeInput = this.page.getByRole("textbox", { name: "Close Time" });
    await closeTimeInput.click();
    await this.page.getByRole("spinbutton", { name: "Hour" }).fill(closeHour);
    await this.page.getByRole("spinbutton", { name: "Minute" }).fill(closeMinute);
  }

  // Helper function to format date
  private formatDateLabel(date: Date) {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  }
}
