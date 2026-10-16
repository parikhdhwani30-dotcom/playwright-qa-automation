import { expect, Page, test, TestInfo, Locator } from "@playwright/test";
import { BasePage } from "../../baseFile";

export class TournamentPage extends BasePage {
  // Navigation
  readonly createTournamentBtn: Locator;
  readonly nextBtn: Locator;
  readonly validationMessages: Locator;
  readonly requiredValidation: Locator;

  // Form elements
  readonly chooseSportsDropdown: Locator;
  readonly tournamentNameInput: Locator;
  readonly timezoneDropdown: Locator;
  readonly centralTimeOption: Locator;
  readonly typeDropdown: Locator;
  readonly descriptionEditor: Locator;

  // Waiver elements
  readonly waiverFileInput: Locator;
  readonly playerWaiverFileInput: Locator;
  readonly uploadSuccessMsg: Locator;

  // Configuration toggles (Team)
  readonly coachToggle: Locator;
  readonly asstCoachToggle: Locator;
  readonly managerToggle: Locator;
  readonly rosterToggle: Locator;

  // Configuration toggles (Player)
  readonly schoolInfoToggle: Locator;
  readonly uniformInfoToggle: Locator;
  readonly bioPhotoToggle: Locator;

  // Location
  readonly locationDropdown: Locator;
  readonly dropdownOptions: Locator;

  // Product
  readonly productNameInput: Locator;
  readonly productImageInput: Locator;
  readonly tapToContinueMsg: Locator;
  readonly addPriceDescLabel: Locator;
  readonly productPriceInput: Locator;
  readonly saveProductBtn: Locator;
  readonly productDescInput: Locator;
  readonly requiredPurchaseToggle: Locator;
  readonly addProductBtn: Locator;

  // Price Option
  readonly addPriceOptionBtn: Locator;
  readonly divisionInput: Locator;
  readonly ageGroupInput: Locator;
  readonly teamFeeInput: Locator;
  readonly playerFeeInput: Locator;
  readonly saveOptionBtn: Locator;
  readonly achToggle: Locator;
  readonly stripeLinkToggle: Locator;
  readonly applePayToggle: Locator;

  // Publish
  readonly publishBtn: Locator;

  // Update flow
  readonly searchBox: Locator;
  readonly editPriceIcon: Locator;

  constructor(page: Page) {
    super(page, "/admin-center");

    // Initialize Locators
    this.createTournamentBtn = page.getByRole("button", { name: "Create Tournament" });
    this.nextBtn = page.getByRole("button", { name: "Next" });
    this.validationMessages = page.locator(".text-red-500");
    this.requiredValidation = page.locator('.text-red-500:has-text("This field is required.")');

    this.chooseSportsDropdown = page.locator('#sportName');
    this.tournamentNameInput = page.getByRole("textbox", { name: "What is the name of your tournament" });
    this.timezoneDropdown = page.locator('ng-select[formcontrolname="timezone"]');
    this.centralTimeOption = page.getByRole("option", { name: "Central Time" });
    this.typeDropdown = page.locator('ng-select[placeholder="Team or Individual Athlete"]');
    this.descriptionEditor = page.locator(".ql-editor").first();

    // Waiver elements
    this.waiverFileInput = page.locator('#waiverInput input[type="file"]');
    this.playerWaiverFileInput = page.locator('#playerWaiverInput input[type="file"]');
    this.uploadSuccessMsg = page.getByText(/Tap anywhere to continue|Files? uploaded successfully/i).last();

    // Configuration toggles (Team)
    this.coachToggle = page.locator('label:has-text("Team Coach Information") div');
    this.asstCoachToggle = page.locator('label:has-text("Team Assistant Coach Information") div');
    this.managerToggle = page.locator('label:has-text("Team Manager Information") div');
    this.rosterToggle = page.locator('label:has-text("Team Roster Information") div');

    // Configuration toggles (Player)
    this.schoolInfoToggle = page.locator('label:has-text("Athlete School Information") div');
    this.uniformInfoToggle = page.locator('label:has-text("Athlete Uniform Information") div');
    this.bioPhotoToggle = page.locator('label:has-text("Athlete Bio, Photo Informatio") div');

    // Location
    this.locationDropdown = page.locator("#locations .ng-select-container");
    this.dropdownOptions = page.locator(".ng-dropdown-panel .ng-option");

    // Product
    this.productNameInput = page.getByRole("textbox", { name: "Add a product name" });
    this.productImageInput = page.locator('input[type="file"]').nth(1);
    this.tapToContinueMsg = page.getByText("Tap anywhere to continue.").last();
    this.addPriceDescLabel = page.locator('label', { hasText: "Click to add price, description options" });
    this.productPriceInput = page.getByRole("textbox", { name: "Enter price..." });
    this.saveProductBtn = page.getByRole("button", { name: "Save", exact: true });
    this.productDescInput = page.getByRole("textbox", { name: "product description" });
    this.requiredPurchaseToggle = page.locator("label").filter({ hasText: "Required Purchase" }).locator("div");
    this.addProductBtn = page.getByRole("button", { name: "Add Product" });

    // Price Option
    this.addPriceOptionBtn = page.getByRole("button", { name: "Add Price Option" });
    this.divisionInput = page.getByRole("textbox", { name: "Enter division" });
    this.ageGroupInput = page.getByRole("textbox", { name: "Enter ageGroup" });
    this.teamFeeInput = page.getByRole("textbox", { name: "Enter team fee" });
    this.playerFeeInput = page.getByRole("textbox", { name: "Enter player fee" });
    this.saveOptionBtn = page.getByRole("button", { name: "Save Option" });
    this.achToggle = page.locator('label:has-text("Allow users to pay via ACH") div');
    this.stripeLinkToggle = page.locator('label:has-text("Allow Stripe Link") div');
    this.applePayToggle = page.locator('label:has-text("Allow Apple Pay") div');

    // Publish
    this.publishBtn = page.getByRole("button", { name: "Publish", exact: true });

    // Update flow
    this.searchBox = page.getByRole("textbox", { name: "Search..." });
    this.editPriceIcon = page.locator("div.flex.items-center.justify-center i.ri-edit-2-fill").first();
  }

  async navigateToTournamentCentral() {
    await this.navigateToAdminCenter();
    await this.navigateToAnyModule("Tournament Central");
    await this.createTournamentBtn.click();
  }

  async clickNextAndCheckValidation() {
    await this.nextBtn.click();
    await this.validationMessages.first().waitFor({ state: "visible", timeout: 10000 });

    const messages = await this.validationMessages.allTextContents();
    console.log("📌 Validation messages:", messages);

    const mandatoryFields = [
      "Choose sport",
      "Tournament Name",
      "Tournament Time Zone",
      "Team or Individual Athlete",
      "Short Tournament Description",
      "Tournament Dates",
      "Registration Open Dates",
      "When Does Registration Close",
    ];

    for (const field of mandatoryFields) {
      await expect(this.requiredValidation.first()).toBeVisible({ timeout: 5000 });
      console.log(`✅ Validation visible for: ${field}`);
    }
  }

  async fillTournamentForm(name: string, tournamentType: "Team" | "Player") {
    await this.page.waitForTimeout(2000);

    await this.selectNgDropdownByIndex(this.chooseSportsDropdown, 0);

    await this.tournamentNameInput.fill(name);

    await this.timezoneDropdown.click();
    await this.centralTimeOption.click();

    // 🔹 Select Team or Player dynamically
    await this.typeDropdown.click();
    await this.page.getByRole("option", { name: tournamentType, exact: true }).click();

    await this.descriptionEditor.fill("This is my tournament");

    await this.selectTournamentDates();
    await this.pickOpenCloseDates("10", "00", "18", "00");
  }


  async uploadWaiver(filePath: string) {
    await this.page.waitForTimeout(1000);
    await this.waiverFileInput.setInputFiles(filePath);

    await this.uploadSuccessMsg.waitFor({ state: "visible", timeout: 30000 });
    await this.uploadSuccessMsg.click();
  }

  async uploadPlayerWaiver(filePath: string) {
    await this.page.waitForTimeout(1000);
    await this.playerWaiverFileInput.setInputFiles(filePath);

    await this.uploadSuccessMsg.waitFor({ state: "visible", timeout: 30000 });
    await this.uploadSuccessMsg.click();
  }

  async handleWaiverUploads(tournamentType: "Team" | "Player", filePath: string) {
    if (tournamentType === "Team") {
      console.log("📤 Uploading both Team and Player waivers...");
      await this.uploadWaiver(filePath);
      await this.uploadPlayerWaiver(filePath);
      await this.nextClick();
    } else {
      console.log("📤 Uploading Player waiver...");
      await this.uploadWaiver(filePath);
      await this.nextClick();
    }
  }

  async nextClick() {
    await this.nextBtn.waitFor({ state: "visible", timeout: 10000 });
    await this.nextBtn.click();
  }

  async configureTeamInformation() {
    await this.coachToggle.click();
    await this.asstCoachToggle.click();
    await this.managerToggle.click();
    await this.rosterToggle.click();

    console.log("✅ Team Coach, Assistant Coach, and Manager toggles turned ON");

    await this.nextBtn.waitFor({ state: "visible", timeout: 10000 });
    await this.nextBtn.click();
  }


  async configurePlayerInformation() {
    await this.schoolInfoToggle.click();
    await this.uniformInfoToggle.click();
    await this.bioPhotoToggle.click();

    console.log("✅ Athlete School Information, Athlete Uniform Information, and Athlete Bio, Photo Information");

    await this.nextBtn.waitFor({ state: "visible", timeout: 10000 });
    await this.nextBtn.click();
  }


  async addLocation() {
    await test.step("Add Location", async () => {
      await this.page.waitForTimeout(3000); // Wait for section transition

      await this.locationDropdown.scrollIntoViewIfNeeded();
      await this.locationDropdown.waitFor({ state: "visible", timeout: 20000 });
      await this.page.waitForTimeout(1000);

      // Attempt to open the dropdown
      await this.locationDropdown.click();
      await this.page.waitForTimeout(2000); // Wait for dropdown animation

      // If dropdown options didn't appear, try clicking again (flaky ng-select handling)
      if (!(await this.dropdownOptions.first().isVisible().catch(() => false))) {
        console.log("⚠️ Dropdown didn't open on first click, trying again...");
        await this.locationDropdown.click({ force: true });
        await this.page.waitForTimeout(2000);
      }

      await this.dropdownOptions.first().waitFor({ state: "visible", timeout: 15000 });
      await this.dropdownOptions.first().click();

      await this.page.waitForTimeout(2000);
      await this.nextBtn.click();
      await this.page.waitForTimeout(3000);
    });
  }


  async addProduct(
    name: string,
    description: string,
    price: string,
    imagePath: string,
    requiredPurchase = false
  ) {

    await this.page.waitForTimeout(2000);
    // Product name
    await this.productNameInput.fill(name);

    // Upload product image
    await this.productImageInput.setInputFiles(imagePath);

    // Confirm upload message
    await this.tapToContinueMsg.waitFor({ state: "visible", timeout: 30000 });

    // Click on the confirmation message
    await this.tapToContinueMsg.click();

    // Add price
    await this.addPriceDescLabel.click();

    await this.productPriceInput.fill(price);

    // Save product
    await this.saveProductBtn.click();

    // Product description
    await this.productDescInput.fill(description);

    // Required Purchase toggle (if true)
    if (requiredPurchase) {
      await this.requiredPurchaseToggle.click();
    }

    // Finalize product
    await this.addProductBtn.click();

    // Next step
    await this.nextBtn.click();

    console.log(`✅ Product added: ${name}`);
  }


  async addPriceOption(tournamentType: "Team" | "Player") {
    console.log("🕐 Starting Add Price Option flow...");

    // Step 1: Click Add Price Option
    await this.addPriceOptionBtn.click();

    // 🧩 Wait for the page or modal reload (the UI reload happens here)
    console.log("🔄 Waiting for page reload after Add Price Option...");
    await this.page.waitForLoadState("networkidle", { timeout: 15000 });

    // 🧠 Sometimes DOM needs a second to re-render the form fields
    await this.page.waitForTimeout(2000);

    // Step 2: Fill in form fields (after reload)
    console.log("✏️ Filling price option details...");
    await this.divisionInput.fill("Global");
    await this.ageGroupInput.fill("22");

    if (tournamentType === "Team") {
      await this.teamFeeInput.fill("20");
    } else {
      await this.playerFeeInput.fill("20");
    }
    await this.saveOptionBtn.click();

    await this.page.waitForTimeout(1000);

    // Confirm upload message
    await this.tapToContinueMsg.waitFor({ state: "visible", timeout: 30000 });

    // Click on the confirmation message
    await this.tapToContinueMsg.click();

    // Step 5: Enable payment toggles
    console.log("🎛️ Enabling payment options...");
    await this.achToggle.click();
    await this.applePayToggle.click();
    console.log("✅ Payment toggles enabled");

    // Step 6: Go to Next
    await this.nextBtn.waitFor({ state: "visible", timeout: 10000 });
    await this.nextBtn.click();

    console.log("➡️ Proceeded to Next step");
  }



  async publishTournament(testInfo: TestInfo) {
    await this.publishBtn.click();
    await this.takeScreenshot(testInfo, "publishTournament.png", this.page);
  }

  // -----------------------
  // UPDATE FLOW METHODS
  // -----------------------
  async openExistingTournament(name: string) {
    await this.searchBox.click();
    await this.searchBox.fill(name);
    await this.page.keyboard.press("Enter");

    // More specific row selection: look for row containing the tournament name AND "PUBLISHED"
    const row = this.page.locator(`datatable-body-row:has-text("${name}")`).filter({ hasText: "PUBLISHED" });
    await expect(row.first()).toBeVisible({ timeout: 15000 });

    // Click edit action inside that row
    await row.first().locator("span").nth(1).click();
  }


  async updateTournamentForm(updatedName: string) {
    await test.step("Update tournament form", async () => {
      await this.page.waitForTimeout(2000);

      await this.page
        .getByRole("textbox", { name: "What is the name of your" })
        .fill(updatedName);

      await this.descriptionEditor.fill("Updated tournament details");

      await this.selectTournamentDates();
      await this.pickOpenCloseDates("08", "00", "19", "00");

    });
  }


  async updatePriceOption(tournamentType: "Team" | "Player") {
    // Wait for and click the edit icon
    await this.page.waitForTimeout(1000);
    await expect(this.editPriceIcon).toBeVisible({ timeout: 20000 });
    await this.editPriceIcon.click();

    // Update fields
    await this.divisionInput.fill("Updated Global");
    await this.ageGroupInput.fill("50");

    if (tournamentType === "Team") {
      await this.teamFeeInput.fill("60");
    } else {
      await this.playerFeeInput.fill("60");
    }

    // Save changes
    await this.saveOptionBtn.click();

    await this.tapToContinueMsg.waitFor({ state: "visible", timeout: 30000 });

    // Click on the confirmation message
    await this.tapToContinueMsg.click();

    // Proceed to next step
    await this.nextBtn.click();

    console.log(`✅ Updated ${tournamentType} fee option`);
  }



  async publishUpdatedTournament(testInfo: TestInfo) {
    await this.publishBtn.click();
    await expect(this.page.getByText("Tournament updated")).toBeVisible();
    await this.takeScreenshot(testInfo, "publishTournament.png", this.page);
  }
}
