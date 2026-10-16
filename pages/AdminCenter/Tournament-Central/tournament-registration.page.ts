import { Page, test, expect, TestInfo } from "@playwright/test";
import { BasePage } from "../../baseFile";

export class TournamentRegistrationPage extends BasePage {
  constructor(page: Page) {
    super(page, "/all-tournaments");
  }

  /**
   * Search and open the registration popup for a given tournament
   *//**
* Search and open the registration popup for a given tournament
*/
  async openRegistrationPopup(tournamentName: string): Promise<Page> {
    // First check if the tournament row is already visible without searching
    const rowLocator = this.page.locator("datatable-body-row", { hasText: tournamentName }).first();
    if (await rowLocator.isVisible()) {
      console.log(`⚡ Tournament "${tournamentName}" already visible, skipping search`);
    } else {
      // Otherwise, search by name
      const searchBox = this.page.getByRole("textbox", { name: "Search..." });
      await searchBox.fill(tournamentName);

      await Promise.all([
        this.page.waitForLoadState("networkidle"),
        this.page.keyboard.press("Enter"),
      ]);

      await rowLocator.waitFor({ state: "visible", timeout: 15000 });
    }

    // Get the registration link
    const urlLocator = rowLocator.locator("span.text-blue-500.underline", { hasText: "http" });
    await urlLocator.waitFor({ state: "visible" });

    const url = (await urlLocator.innerText()).trim();
    console.log(`🔗 Found registration URL: ${url}`);

    // Open it in a new tab
    const newTab = await this.page.context().newPage();
    await newTab.goto(url, { waitUntil: "domcontentloaded" });

    console.log(`✅ Registration page opened in new tab for ${tournamentName}`);
    return newTab;
  }


  /**
   * Register as Player
   */
  async registerPlayer(popup: Page, testInfo: TestInfo) {

    await popup.getByRole("button", { name: "Register" }).click();

    await this.fillContactInfo(popup);
    await this.fillAthleteInfo(popup);
    // ❌ Removed fillCoachInfo here – not needed for Player
    await this.fillClothingAndTier(popup);

    await popup.getByRole("button", { name: "Next" }).click();
    await this.completeWaiver(popup);

    await this.completePurchase(popup);
    await this.fillBillingAddress(popup);
    await popup.waitForTimeout(1000); // Small delay to ensure payment process completes

    await this.fillStripePayment(popup);

    await popup.getByRole("button", { name: "Register" }).click();
    await expect(
      popup.getByText(/Congrats![\s\S]*email confirmations/i)
    ).toBeVisible({ timeout: 15000 });

    console.log("✅ Player registration completed");

    await this.takeScreenshot(testInfo, "playerRegistration.png", popup);
    // uses popup instead of this.page

  }

  /**
   * Register as Team
   */
  async registerTeam(popup: Page, testInfo: TestInfo) {

    await popup.getByRole("button", { name: "Register" }).click();

    await this.fillContactInfo(popup, { isTeam: true });
    await this.fillCoachInfo(popup, { includeManager: true, includeCoach: true, includeAssistant: true });
    await this.page.waitForTimeout(1000);
    const tierDropdown = popup.locator("ng-select").filter({ hasText: "Choose Registration Tier" }).getByRole("combobox");
    await tierDropdown.click();
    await popup.locator(".ng-dropdown-panel .ng-option").first().click();
    await popup.getByRole("button", { name: "Next" }).click();
    await popup.getByRole("button", { name: "Next" }).click();
    await this.completeWaiver(popup);

    await this.completePurchase(popup);
    await this.fillBillingAddress(popup);
    await this.fillStripePayment(popup);

    await popup.getByRole("button", { name: "Register" }).click();
    await expect(
      popup.getByText(/Congrats![\s\S]*email confirmations/i)
    ).toBeVisible({ timeout: 15000 });

    console.log("✅ Team registration completed");
    await this.takeScreenshot(testInfo, "teamRegistration.png", popup);


  }

  /* ------------------------
     🔹 Reusable helpers
  -------------------------*/
  private async fillContactInfo(popup: Page, opts?: { isTeam?: boolean }) {
    await popup.getByRole("textbox", { name: "Enter first name" }).fill("Dhwani");
    await popup.getByRole("textbox", { name: "Enter last name" }).fill("Parikh");
    await popup.getByRole("textbox", { name: "Enter contact email" }).fill("dhwani@yopmail.com");
    await popup.getByRole("textbox", { name: "Enter phone" }).fill("9512672992");

    if (opts?.isTeam) {
      await popup.getByRole("textbox", { name: "What is the name of your team" }).fill("Golf Team");
      // await popup.getByRole("combobox").getByRole("textbox").click();
      // await popup.getByRole("option").first().click();
    }
  }

  private async fillAthleteInfo(popup: Page) {
    await popup.getByRole("textbox", { name: "Enter athlete first name" }).fill("Alska");
    await popup.getByRole("textbox", { name: "Enter athlete last name" }).fill("Parikh");
    await popup.getByRole("textbox", { name: "Enter athlete email" }).fill("alska@yopmail.com");
    await popup.getByRole("textbox", { name: "Enter athlete phone" }).fill("9512672992");

    const dobInput = popup.locator('input.form-control.input[placeholder="Enter athlete date of birth"]');
    await dobInput.fill("06-05-1996");
    await dobInput.press("Escape");
    await dobInput.press("Tab");
    await popup.keyboard.press("ArrowDown");
    await popup.keyboard.press("Enter");

    await popup.getByRole("textbox", { name: "Enter athlete street address" }).fill("123 Main St");
    await popup.getByRole("textbox", { name: "Enter athlete city" }).fill("San Francisco");
    await popup.getByRole("textbox", { name: "Enter athlete state" }).fill("CA");
    await popup.getByRole("textbox", { name: "Enter athlete zip code" }).fill("94101");
    await popup.getByRole("textbox", { name: "Enter athlete school name" }).fill("Devine");
    await popup.getByRole("textbox", { name: "Enter athlete’s school" }).fill("23 Main St");
    await popup.getByRole("textbox", { name: "Enter athlete position" }).fill("2");

    const gradeDropdown = popup.locator("div").filter({ hasText: /^Select athlete grade$/ }).nth(1);
    await gradeDropdown.click();
    await popup.locator(".ng-dropdown-panel .ng-option").first().click();
  }

  private async fillCoachInfo(
    popup: Page,
    opts?: { includeManager?: boolean; includeCoach?: boolean; includeAssistant?: boolean }
  ) {
    if (opts?.includeManager) {
      await popup.getByRole("textbox", { name: "Enter manager first name" }).fill("Ronix");
      await popup.getByRole("textbox", { name: "Enter manager last name" }).fill("Manager");
      await popup.getByRole("textbox", { name: "Enter manager email" }).fill("Manager@yopmail.com");
      await popup.getByRole("textbox", { name: "Enter manager phone" }).fill("5956585412");
    }

    if (opts?.includeCoach) {
      await popup.getByRole("textbox", { name: "Enter coach first name" }).fill("Rafal");
      await popup.getByRole("textbox", { name: "Enter coach last name" }).fill("San");
      await popup.getByRole("textbox", { name: "Enter coach email" }).fill("rafal@yopmail.com");
      await popup.getByRole("textbox", { name: "Enter coach phone" }).fill("5956585412");
    }

    if (opts?.includeAssistant) {
      await popup.getByRole("textbox", { name: "Enter assistant coach first" }).fill("Assitan");
      await popup.getByRole("textbox", { name: "Enter assistant coach last" }).fill("last");
      await popup.getByRole("textbox", { name: "Enter assistant coach email" }).fill("Assitant@yopmail.com");
      await popup.getByRole("textbox", { name: "Enter assistant coach phone" }).fill("5956585412");
    }
  }

  private async fillClothingAndTier(popup: Page) {
    await popup.getByRole("textbox", { name: "Enter coach's email" }).fill("alska@yopmail.com");
    await popup.getByRole("textbox", { name: "Enter coach’s mobile number" }).fill("1234567890");

    await popup.getByRole("textbox", { name: "Enter jersey size" }).fill("L");
    await popup.getByRole("textbox", { name: "Enter shirt size" }).fill("L");
    await popup.getByRole("textbox", { name: "Enter short size" }).fill("L");


    await this.page.waitForTimeout(1000);
    const tierDropdown = popup.locator("ng-select").filter({ hasText: "Choose Registration Tier" }).getByRole("combobox");
    await tierDropdown.click();
    await popup.locator(".ng-dropdown-panel .ng-option").first().click();
  }

  private async completeWaiver(popup: Page) {
    await popup.getByRole("textbox", { name: /Full Name/ }).fill("Dhwani Parikh");
    await popup.getByRole("button", { name: "Next" }).click();
  }

  private async completePurchase(popup: Page) {
    await popup.locator('input[role="combobox"]').first().click();
    await popup.locator(".ng-dropdown-panel .ng-option").first().click();
    await popup.getByRole("button", { name: "Click to Purchase" }).click();
    await popup.getByRole("button", { name: "Next" }).click();
  }

  private async fillBillingAddress(popup: Page) {
    await popup.getByPlaceholder("Enter your full name").fill("John Doe");
    await popup.getByPlaceholder("Enter Address", { exact: true }).fill("123 Main St");
    await popup.getByPlaceholder("Enter city").fill("Springfield");
    await popup.getByPlaceholder("Enter state").fill("IL");
    await popup.getByPlaceholder("Enter zip").fill("62704");
  }

  private async fillStripePayment(popup: Page) {

    await popup.waitForLoadState();

    // Card Number
    const cardFrame = popup.frameLocator('iframe[title="Secure payment input frame"]').first();
    await cardFrame.locator('#payment-numberInput').fill('4242424242424242');

    // Expiry
    await cardFrame.getByRole("textbox", { name: "Expiration date" }).fill("12 / 34");
    await cardFrame.locator('input[name="cvc"]').fill("123");
  }
}
