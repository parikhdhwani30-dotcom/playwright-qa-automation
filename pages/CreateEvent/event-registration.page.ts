import { expect, test, Page, TestInfo, Locator, FrameLocator } from "@playwright/test";
import { BasePage } from "../baseFile";

export default class EventRegistrationPage extends BasePage {
  // Locators
  readonly popupButton: Locator;
  readonly campsBtn: Locator;
  readonly hardyLink: Locator;
  readonly eventCard: Locator;
  readonly registerBtnOverlay: Locator;
  readonly athleteDropdown: Locator;
  readonly athletePanel: Locator;
  readonly athleteOption: Locator;
  readonly costDropdown: Locator;
  readonly costPanel: Locator;
  readonly costOption: Locator;
  readonly registerBtn: Locator;
  readonly nextBtn: Locator;
  readonly coverageCheckbox: Locator;
  readonly stripeIframe: FrameLocator;
  readonly cardNumberInput: Locator;
  readonly cardExpiryInput: Locator;
  readonly cardCvcInput: Locator;
  readonly payBtn: Locator;
  readonly tapToContinueMsg: Locator;

  constructor(page: Page) {
    super(page, "/sketchplay-dashboard");

    // Initialize Locators
    this.hardyLink = page.getByRole("link", { name: /HARdy/i });
    this.campsBtn = page.getByRole("button", { name: /Camps/i });
    this.popupButton = page.locator("#announcementPopup").getByRole("button").filter({ hasText: /^$/ });
    
    // Scoped locators for event card
    this.eventCard = page.locator('div').filter({ has: page.getByRole('heading', { name: 'Sport Event' }) }).filter({ has: page.locator('.relative') }).last();
    this.registerBtnOverlay = this.eventCard.locator('.relative').first();

    this.athleteDropdown = page.locator('#athlete .ng-select-container');
    this.athletePanel = page.locator('ng-dropdown-panel');
    this.athleteOption = this.athletePanel.locator('.ng-option');

    this.costDropdown = page.locator('#cost .ng-select-container');
    this.costPanel = page.locator('ng-dropdown-panel');
    this.costOption = this.costPanel.locator('.ng-option');

    this.registerBtn = page.locator("#registerBtn");
    this.nextBtn = page.getByRole("button", { name: "Next" });
    this.coverageCheckbox = page.getByRole("checkbox", { name: /Accept Coverage/i });

    this.stripeIframe = page.frameLocator('iframe[name^="__privateStripeFrame"]').first();
    this.cardNumberInput = this.stripeIframe.locator('input[id="payment-numberInput"]');
    this.cardExpiryInput = this.stripeIframe.locator('input[id="payment-expiryInput"]');
    this.cardCvcInput = this.stripeIframe.locator('input[id="payment-cvcInput"]');

    this.payBtn = page.getByRole("button", { name: /Complete Payment/i });
    this.tapToContinueMsg = page.getByText("Tap anywhere to continue.");
  }

  async announcementpopup() {
    // ✅ Optional announcement popup click (if visible)
    if (await this.popupButton.isVisible({ timeout: 7000 }).catch(() => false)) {
      await this.popupButton.click({ force: true });
      console.log("✅ Announcement popup clicked successfully.");
    } else {
      console.log("ℹ️ No announcement popup detected.");
    }
  }

  /**
   * Open Camps module and select the first available event
   */
  async openCampsModule() {
    await test.step("Navigate to Camps Module", async () => {
      await this.page.waitForTimeout(3000);
      
      // Check if we need to navigate first
      if (await this.hardyLink.isVisible()) {
          await this.hardyLink.click();
          await this.page.waitForTimeout(3000);
          await this.campsBtn.click();
          await this.page.waitForTimeout(3000);
      }

      await this.eventCard.scrollIntoViewIfNeeded();
      
      // Hover on the relative div to reveal the Register button
      await this.registerBtnOverlay.hover();
      await this.page.waitForTimeout(1000); // Wait for hover transition

      // Click the Register button within that card
      const registerBtn = this.registerBtnOverlay.getByRole('button', { name: "Register" });
      await registerBtn.click();

      await this.page.waitForTimeout(5000);
    });
  }

  async selectAthlete() {
    await test.step("Select athlete and cost", async () => {

      // ------- ATHLETE DROPDOWN -------
      await expect(this.athleteDropdown).toBeVisible({ timeout: 20000 });

      console.log("⏳ Opening athlete dropdown...");
      await this.athleteDropdown.click();
      await this.page.waitForTimeout(3000);
      
      // Wait for dropdown panel to appear
      await this.page.waitForSelector('ng-dropdown-panel', { state: 'attached', timeout: 10000 });

      // Wait until at least one option is visible
      await expect(this.athleteOption.first()).toBeVisible({ timeout: 20000 });

      await this.page.waitForTimeout(500);

      // Click the first visible option
      await this.athleteOption.first().click({ force: true, delay: 100 });
      console.log("✅ Athlete selected successfully.");

      // ------- COST DROPDOWN -------
      await expect(this.costDropdown).toBeVisible({ timeout: 20000 });

      console.log("⏳ Opening cost dropdown...");
      await this.costDropdown.click();

      await this.page.waitForSelector('ng-dropdown-panel', { state: 'attached', timeout: 10000 });

      // Wait until options load and become visible
      await expect(this.costOption.first()).toBeVisible({ timeout: 20000 });

      await this.page.waitForTimeout(500);
      await this.costOption.first().click({ force: true, delay: 100 });
      console.log("✅ Cost selected successfully.");

      // ------- REGISTER BUTTON -------
      await expect(this.registerBtn).toBeVisible({ timeout: 20000 });

      console.log("⏳ Waiting for register button to be enabled...");
      await this.page.waitForFunction(
        (el) => el && !el.hasAttribute("disabled"),
        await this.registerBtn.elementHandle(),
        { timeout: 20000 }
      );

      await this.registerBtn.click({ delay: 100 });
      console.log("✅ Athlete and cost selected successfully, form submitted.");

      await this.page.waitForTimeout(2000);
    });
  }


  /**
   * Complete registration steps (Next buttons + insurance checkbox)
   */
  async completeSteps() {
    await test.step("Complete registration steps", async () => {
      await expect(this.nextBtn).toBeVisible({ timeout: 20000 });

      await this.nextBtn.click();
      await this.page.waitForTimeout(1000);

      await expect(this.coverageCheckbox).toBeVisible({ timeout: 10000 });
      await this.coverageCheckbox.check();

      await this.nextBtn.click();
      await this.page.waitForTimeout(1000);
      await this.nextBtn.click();
      await this.page.waitForTimeout(1500);
    });
  }

  /**
   * Fill Stripe payment fields (Card number, expiry, CVV)
   */
  async fillPaymentDetails() {
    await test.step("Enter Stripe payment details inside iframe", async () => {
      console.log("⏳ Waiting for Stripe iframe to load...");
      await this.page.waitForSelector('iframe[name^="__privateStripeFrame"]', {
        timeout: 20000,
      });

      // Wait until card field becomes interactable inside that iframe
      await this.cardNumberInput.waitFor({
        state: "visible",
        timeout: 20000,
      });

      console.log("✅ Stripe iframe detected. Filling details...");

      // Fill details
      await this.cardNumberInput.fill("4242 4242 4242 4242");
      await this.cardExpiryInput.fill("02 / 66");
      await this.cardCvcInput.fill("125");

      console.log("✅ Payment fields filled successfully inside iframe.");
      await this.page.waitForTimeout(1000);
    });
  }

  /**
   * Complete payment and close confirmation popup
   */
  async completePayment(testInfo: TestInfo) {
    await test.step("Complete payment", async () => {
      await expect(this.payBtn).toBeVisible({ timeout: 15000 });
      await this.payBtn.click();

      if (await this.tapToContinueMsg.isVisible({ timeout: 10000 }).catch(() => false)) {
        await this.tapToContinueMsg.click();
      }

      console.log("✅ Payment completed successfully.");
      await this.page.waitForTimeout(3000);

      await this.takeScreenshot(testInfo, 'Complete Payment.png');
    });
  }
}
