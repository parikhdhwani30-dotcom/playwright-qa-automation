import { Page, test, expect, Locator } from "@playwright/test";
import { BasePage } from "../baseFile";

export default class CreateEventPage extends BasePage {
  // Locators
  readonly popupButton: Locator;
  readonly addButton: Locator;
  readonly eventTypeInput: Locator;
  readonly eventNameInput: Locator;
  readonly datePickerInput: Locator;
  readonly descriptionEditor: Locator;
  readonly startTimePicker: Locator;
  readonly endTimePicker: Locator;
  readonly openCostPopUpBtn: Locator;
  readonly costInput: Locator;
  readonly saveCostBtn: Locator;
  readonly locationNameInput: Locator;
  readonly addressLine1Input: Locator;
  readonly addressDropdown: Locator;
  readonly firstAddressSuggestion: Locator;
  readonly saveAddLocationBtn: Locator;
  readonly tapToContinueMsg: Locator;
  readonly saveEventBtn: Locator;
  readonly confirmPublishBtn: Locator;

  constructor(page: Page) {
    super(page, "/sketchplay-dashboard");

    // Initialize Locators
    this.popupButton = page.locator("#announcementPopup").getByRole("button").filter({ hasText: /^$/ });
    this.addButton = page.locator('button:has(i.ri-add-line)').first();
    this.eventTypeInput = page.locator("#eventType .ng-input input");
    this.eventNameInput = page.locator("#eventName");
    this.datePickerInput = page.locator("#eventDatePicker");
    this.descriptionEditor = page.locator("#quill_custom_container_class_dark .ql-editor");
    this.startTimePicker = page.locator("#startTimePicker");
    this.endTimePicker = page.locator("#endTimePicker");
    this.openCostPopUpBtn = page.locator("#openEventCostPopUp");
    this.costInput = page.getByPlaceholder("Enter cost...");
    this.saveCostBtn = page.getByRole("button", { name: "Save", exact: true });
    this.locationNameInput = page.locator("#locationName");
    this.addressLine1Input = page.locator('input[formcontrolname="addressLine1"]');
    this.addressDropdown = page.locator('ul.absolute');
    this.firstAddressSuggestion = this.addressDropdown.locator('li').first();
    this.saveAddLocationBtn = page.locator("#addEventLocationBtn");
    this.tapToContinueMsg = page.getByText("Tap anywhere to continue.").last();
    this.saveEventBtn = page.locator("#saveEvent");
    this.confirmPublishBtn = page.getByRole('button', { name: 'Confirm & Publish' });
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

  /** ✅ Navigate to Camps module */
  async openCampsModule() {
    await test.step("Navigate to Camps Module", async () => {
      await this.page.waitForTimeout(2000);
      await this.addButton.scrollIntoViewIfNeeded();
      await this.addButton.click();
    });
  }

  /** ✅ Fill event basic details */
  async fillEventDetails(eventName: string, description: string) {
    await test.step("Fill Event Details", async () => {
      await this.page.waitForTimeout(1000);

      /** Select event type */
      await this.eventTypeInput.click();
      await this.page.getByRole("option", { name: "Camp" }).waitFor();
      await this.page.getByRole("option", { name: "Camp" }).click();

      /** Event name */
      await this.page.waitForTimeout(800);
      await this.eventNameInput.fill(eventName);

      /** Date picker */
      await this.page.waitForTimeout(800);
      await this.datePickerInput.click();

      await this.page.waitForSelector(".flatpickr-calendar.open", {
        timeout: 10000,
      });

      const today = new Date().getDate().toString();

      const todayLocator = this.page.locator(
        `.flatpickr-day:not(.prevMonthDay):not(.nextMonthDay):text-is("${today}")`
      );

      await todayLocator.first().waitFor({ timeout: 5000 });
      await todayLocator.first().click();

      await this.page.waitForTimeout(1000);

      /** Description */
      await this.descriptionEditor.click();
      await this.descriptionEditor.fill(description);

      await this.page.waitForTimeout(1000);
    });
  }

  /** ✅ Select event start & end times */
  async selectEventTimes(
    startHour = "10",
    startMinute = "00",
    endHour = "12",
    endMinute = "00"
  ) {
    await test.step("Select Event Start & End Times", async () => {
      await this.page.waitForTimeout(1000);

      /** START TIME */
      await this.startTimePicker.click();
      const startPicker = this.page.locator(".flatpickr-calendar.open");
      await startPicker.waitFor({ timeout: 5000 });

      await startPicker.locator(".flatpickr-hour").fill(startHour);
      await startPicker.locator(".flatpickr-minute").fill(startMinute);

      await this.page.keyboard.press("Enter");
      await this.page.waitForTimeout(1000);

      /** END TIME */
      await this.endTimePicker.click();
      const endPicker = this.page.locator(".flatpickr-calendar.open");
      await endPicker.waitFor({ timeout: 5000 });

      await endPicker.locator(".flatpickr-hour").fill(endHour);
      await endPicker.locator(".flatpickr-minute").fill(endMinute);

      const pmOption = endPicker.locator('.flatpickr-am-pm[aria-label="PM"]');
      if (await pmOption.isVisible().catch(() => false)) {
        await pmOption.click();
      }

      await this.page.keyboard.press("Enter");
      await this.page.waitForTimeout(1000);
    });
  }

  /** ✅ Add event cost */
  async addEventCost(cost: string) {
    await test.step("Add Event Cost", async () => {
      await this.page.waitForTimeout(1000);

      await this.openCostPopUpBtn.click();

      await this.costInput.waitFor();
      await this.costInput.fill(cost);

      await this.page.waitForTimeout(1000);

      await this.saveCostBtn.waitFor({ timeout: 5000 });
      await this.saveCostBtn.click();

      await this.page.waitForTimeout(2000);
    });
  }

  /** ✅ Fill location details */
  async fillLocationDetails() {
    await test.step("Fill Location Details", async () => {

      await this.page.waitForTimeout(2000);

      await this.locationNameInput.fill("Alabama");

      await this.page.waitForTimeout(1000);

      // Use pressSequentially to trigger the autocomplete dropdown reliably
      await this.addressLine1Input.click();
      await this.addressLine1Input.fill(""); // Clear existing text
      await this.page.waitForTimeout(1000);
      await this.addressLine1Input.pressSequentially('Alabama', { delay: 300 });

      // Wait for the results to process and render
      await this.page.waitForTimeout(3000);

      // Fallback: if dropdown isn't visible, try to trigger it by pressing space
      if (!(await this.addressDropdown.isVisible())) {
          await this.addressLine1Input.press(' ');
          await this.page.waitForTimeout(500);
          await this.addressLine1Input.press('Backspace');
          await this.page.waitForTimeout(2000);
      }

      // Wait for the drop-down container and specifically our suggestion
      await this.addressDropdown.waitFor({ state: 'visible', timeout: 20000 });
      
      const alabamaSuggestion = this.addressDropdown.locator('li').filter({ hasText: /Alabama/i }).first();
      await alabamaSuggestion.waitFor({ state: 'visible', timeout: 15000 });
      await alabamaSuggestion.click();
      await this.page.waitForTimeout(3000);

      // ✅ Save & Add button
      await this.saveAddLocationBtn.scrollIntoViewIfNeeded();
      await this.saveAddLocationBtn.waitFor({ state: "visible", timeout: 30000 });
      await this.saveAddLocationBtn.click({ delay: 150 });

      // ✅ WAIT for popup in normal mode (debug is slower so popup always appears)
      await this.page.waitForTimeout(3000); // give popup time to appear

      // ✅ Increased timeout from 8000 → 20000 (normal mode needs more time)
      if (await this.tapToContinueMsg.isVisible({ timeout: 20000 }).catch(() => false)) {
        await this.tapToContinueMsg.click({ delay: 100 });
        await this.page.waitForTimeout(1500);
      }

    });
  }


  /** ✅ Save & Preview */
  async saveAndPreview() {
    await test.step("Save and Preview", async () => {
      await this.saveEventBtn.click();
      await this.page.waitForTimeout(2000);

      // Publish event
      await this.confirmPublishBtn.waitFor({ state: 'visible', timeout: 10000 });
      await this.confirmPublishBtn.click();

      await this.tapToContinueMsg.click();
    });
  }
}
