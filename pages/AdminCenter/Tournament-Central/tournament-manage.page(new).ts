import { expect, Page, test, Locator, TestInfo } from "@playwright/test";
import { BasePage } from "../../baseFile";
import { attachScreenshot } from "../../../utils/allureScreenshot";

export class TournamentManagePage extends BasePage {

  // Locators
  readonly manageLink: Locator;
  readonly settingsIcon: Locator;
  readonly deleteConfirmBtn: Locator;
  readonly deleteBracketConfirmBtn: Locator;
  readonly disableActionButton: Locator;

  // Pool Play Locators
  readonly poolPlayBtn: Locator;
  readonly deleteAllPoolsBtn: Locator;
  readonly autoGeneratePoolsBtn: Locator;
  readonly autoGenerateTitle: Locator;
  readonly teamsPerPoolInput: Locator;
  readonly ageGroupsDropdown: Locator;
  readonly submitBtn: Locator;
  readonly proceedBtn: Locator;
  readonly addPoolBtn: Locator;
  readonly schedulePoolGamesBtn: Locator;

  // Schedule Locators
  readonly scheduleSettingsPanel: Locator;
  readonly gameStartTimeInput: Locator;
  readonly gameEndTimeInput: Locator;
  readonly gameLengthInput: Locator;
  readonly timeBetweenGamesInput: Locator;
  readonly saveScheduleBtn: Locator;
  readonly navigateScheduleBtn: Locator;
  readonly showAddTournamentCourtBtn: Locator;
  readonly courtCountInput: Locator;
  readonly createCourtBtn: Locator;
  readonly refreshDataBtn: Locator;

  // Bracket Locators
  readonly goBackBtn: Locator;
  readonly bracketsTabBtn: Locator;
  readonly createBracketBtn: Locator;
  readonly scheduleBracketBtn: Locator;
  readonly deleteBracketBtn: Locator;

  // Common
  readonly deleteIconRed: Locator;

  constructor(page: Page) {
    super(page, "/admin-center");

    // Initialize Locators
    this.manageLink = page.locator("a#manage_tournament");
    this.settingsIcon = page.locator("svg.lucide-settings");
    this.deleteConfirmBtn = page.locator("button.swal2-confirm");
    this.deleteBracketConfirmBtn = page.locator("#deleteBracketConfirm");
    this.disableActionButton = page.locator("#isDisableActionButton");

    // Pool Play
    this.poolPlayBtn = page.getByRole("button", { name: "Pool Play" }).first();
    this.deleteAllPoolsBtn = page.locator("#deleteAllPools");
    this.autoGeneratePoolsBtn = page.getByRole("button", { name: "Auto Generate Pools" });
    this.autoGenerateTitle = page.locator('h5.text-16', { hasText: 'Auto Generate Pools' });
    this.teamsPerPoolInput = page.getByPlaceholder("Number of Teams per Pool");
    this.ageGroupsDropdown = page.locator('#ageGroups');
    this.submitBtn = page.getByRole("button", { name: "Submit" });
    this.proceedBtn = page.locator('button.swal2-confirm', { hasText: 'Yes, Proceed' });
    this.addPoolBtn = page.locator("#addPool");
    this.schedulePoolGamesBtn = page.getByRole("button", { name: "Schedule Pool Games" });

    // Schedule
    this.scheduleSettingsPanel = page.locator('.schedule-settings-box:has(h5:text("Games Start At"))');
    this.gameStartTimeInput = page.locator('input[formcontrolname="gameStartTime"]');
    this.gameEndTimeInput = page.locator('input[formcontrolname="gameEndTime"]');
    this.gameLengthInput = page.locator("#gameLength");
    this.timeBetweenGamesInput = page.locator("#timeBetweenGames");
    this.saveScheduleBtn = page.getByRole("button", { name: "Save Schedule Settings" });
    this.navigateScheduleBtn = page.locator('#navigateSchedule');
    this.showAddTournamentCourtBtn = page.locator("#showAddTournamentCourt");
    this.courtCountInput = page.locator("#create");
    this.createCourtBtn = page.locator("#court");
    this.refreshDataBtn = page.locator('button#refreshData').filter({ hasText: 'Refresh' });

    // Bracket
    this.goBackBtn = page.locator("#goBack");
    this.bracketsTabBtn = page.locator('button:has-text("Brackets")').first();
    this.createBracketBtn = page.locator("#createBracket");
    this.scheduleBracketBtn = page.locator("#schedule");
    this.deleteBracketBtn = page.locator('button[title="Delete bracket"]');

    // Common
    this.deleteIconRed = page.locator("th button.text-red-500");
  }

  /* =========================================================
     COMMON HELPERS
  ========================================================== */

  async openManageAndClickSettings(tournamentName: string) {

    await test.step(`Open Manage for ${tournamentName}`, async () => {

      console.log("─────────────────────────────────────────────");
      console.log(`🔍 Searching for tournament: ${tournamentName}`);

      // Search tournament
      await this.searchUser(tournamentName);

      // Wait for search result row
      const targetRow = this.page.locator("datatable-row-wrapper", {
        hasText: tournamentName,
      });

      await expect(targetRow).toBeVisible({ timeout: 20000 });

      console.log("⚙️ Clicking Settings icon...");
      await this.page.waitForTimeout(1000);
      // Click settings icon (gear icon)
      const settingsIcon = targetRow.locator("svg.lucide-settings").first();
      await expect(settingsIcon).toBeVisible({ timeout: 10000 });
      await settingsIcon.click({ force: true });

      await this.page.waitForTimeout(1000);
      console.log("🖱️ Clicking Manage button...");

      // Click Manage button
      await expect(this.manageLink).toBeVisible({ timeout: 20000 });
      await this.manageLink.click({ force: true });

      await this.page.waitForLoadState("domcontentloaded");

      console.log("✅ Manage screen opened successfully.");
      console.log("─────────────────────────────────────────────");
    });
  }




  private async confirmDeletion() {

    const confirmBtn = this.deleteConfirmBtn.or(this.deleteBracketConfirmBtn).or(this.disableActionButton).first();

    try {
      await confirmBtn.waitFor({ state: "visible", timeout: 5000 });
      await confirmBtn.click({ force: true });
      await this.page.waitForTimeout(800);
      console.log("✅ Confirm button clicked.");
    } catch {
      console.log("ℹ️ No confirmation popup appeared.");
      return;
    }

    await this.tapAnywhereIfVisible();

    await this.page.reload({ waitUntil: 'networkidle' });
    await this.page.waitForTimeout(1500);
  }



  private async dragAllTeamsToTarget(
    sourceLocator: string,
    targetLocator: Locator,
    testInfo: TestInfo
  ) {

    console.log("🏀 Performing drag & drop...");

    await expect(this.page.locator(sourceLocator).first())
      .toBeVisible({ timeout: 20000 });

    await expect(targetLocator).toBeVisible({ timeout: 20000 });

    let teamCount = await this.page.locator(sourceLocator).count();
    console.log(`✅ Found ${teamCount} draggable teams.`);

    for (let i = 0; i < teamCount; i++) {

      // ✅ Always re-fetch fresh first element
      const handle = this.page.locator(sourceLocator).first();
      await expect(handle).toBeVisible({ timeout: 10000 });
      const sourceBox = await handle.boundingBox();
      const targetBox = await targetLocator.boundingBox();

      if (!sourceBox || !targetBox) {
        console.log("⚠️ boundingBox missing, skipping...");
        continue;
      }

      console.log(`↪️ Dragging team ${i + 1}...`);

      await this.page.mouse.move(sourceBox.x + 10, sourceBox.y + 10);
      await this.page.mouse.down();
      await this.page.waitForTimeout(1500);

      // Activate CDK drag
      await this.page.mouse.move(sourceBox.x + 40, sourceBox.y + 40, { steps: 10 });
      await this.page.waitForTimeout(1500);

      await this.page.mouse.move(
        targetBox.x + targetBox.width / 2,
        targetBox.y + targetBox.height / 2,
        { steps: 25 }
      );

      await this.page.mouse.up();
      await this.page.waitForTimeout(1500);
      await this.takeScreenshot(testInfo, "DragAndDrop.png", this.page);


      console.log(`✅ Team ${i + 1} dropped.`);
    }
  }


  private async deleteAllCourtsIfExist() {
    while (await this.deleteIconRed.count() > 0) {
      console.log("🗑 Deleting court...");
      await this.deleteIconRed.first().click();
      await this.confirmDeletion();
      await this.page.waitForTimeout(1500);
    }

    console.log("✅ All courts removed (if existed).");
  }

  private async deleteAllBracketsIfExist() {
    await this.page.waitForTimeout(2000);

    while (await this.deleteBracketBtn.count() > 0) {
      console.log("🗑 Deleting bracket...");
      await this.page.waitForTimeout(1500);
      await this.deleteBracketBtn.first().click();
      await this.page.waitForTimeout(1500);
      await this.confirmDeletion();
      await this.page.waitForTimeout(1500);
    }

    console.log("✅ All brackets removed (if existed).");
  }

  /* =========================================================
     POOL PLAY FLOW
  ========================================================== */

  async handlePoolPlayFlow(testInfo: TestInfo) {

    await test.step("Pool Play Flow", async () => {

      console.log("🏀 Opening Pool Play...");
      await this.poolPlayBtn.click();
      await this.page.waitForTimeout(1500);

      // Delete existing pools first
      if (await this.deleteAllPoolsBtn.isVisible().catch(() => false)) {
        console.log("🗑 Deleting existing pools...");
        await this.deleteAllPoolsBtn.click();
        await this.confirmDeletion();
      }

      // Auto Generate
      console.log("⚙️ Auto Generate Pools...");
      await this.page.waitForTimeout(1500);
      await this.autoGeneratePoolsBtn.click();

      await expect(this.autoGenerateTitle).toBeVisible();

      await this.teamsPerPoolInput.fill("2");

      await this.ageGroupsDropdown.click();
      await this.page.locator('.ng-option').first().click();

      // Close the dropdown so the submit button is interactable
      await this.page.keyboard.press("Escape");

      await this.submitBtn.click();

      if (await this.proceedBtn.isVisible().catch(() => false)) {
        await this.proceedBtn.click();
      }

      await this.tapAnywhereIfVisible();
      await this.page.reload({ waitUntil: 'networkidle' });


      console.log("✅ Auto Generate Submitted.");

      await this.takeScreenshot(testInfo, "Pool_AutoGenerate.png", this.page);

      await this.page.waitForTimeout(10000);

      // Delete auto generated pools (as per your flow)
      if (await this.deleteAllPoolsBtn.isVisible().catch(() => false)) {
        console.log("🗑 Deleting auto-generated pools...");
        await this.deleteAllPoolsBtn.click();
        await this.confirmDeletion();
      }

      console.log("➕ Adding Manual Pool...");
      await this.addPoolBtn.click();
      await this.page.waitForTimeout(1500);
      await this.tapAnywhereIfVisible();

      const dropZone = this.page.locator("tbody").first();

      await this.dragAllTeamsToTarget(
        'div[draggable="true"] span.text-white',
        dropZone, testInfo
      );

      // Schedule Pool Games
      await this.page.waitForTimeout(2000);
      await this.takeScreenshot(testInfo, "Pool_ManualCreated.png", this.page);

      await expect(this.schedulePoolGamesBtn).toBeVisible();
      await this.schedulePoolGamesBtn.click({ force: true });



      console.log("✅ Pool Play Completed.");
    });
  }


  async setScheduleTimes(startHour = "07", endHour = "10", endPeriod = "PM", testInfo: TestInfo) {
    await test.step("Set schedule start/end times", async () => {

      console.log("─────────────────────────────────────────────");
      console.log("🕒 Waiting for Schedule Settings screen to load...");

      await this.page.waitForTimeout(1000);
      // ✅ Wait for the schedule settings panel to fully load
      await expect(this.scheduleSettingsPanel.first()).toBeVisible({ timeout: 30000 });
      console.log("✅ Schedule Settings screen loaded.");

      // ✅ Wait for time picker input fields to appear
      await expect(this.gameStartTimeInput.first()).toBeVisible({ timeout: 10000 });
      console.log("✅ Timepicker inputs are visible. Starting setup...");

      // Count time blocks
      const dayBlocks = this.scheduleSettingsPanel;
      const count = await dayBlocks.count();
      console.log(`📅 Found ${count} schedule time blocks.`);

      for (let i = 0; i < count; i++) {
        console.log(`⏰ Editing block ${i + 1}`);

        // -------- START TIME --------
        const startInput = dayBlocks.nth(i).locator('input[formcontrolname="gameStartTime"]');
        await startInput.scrollIntoViewIfNeeded();
        await startInput.click({ force: true });
        await this.page.waitForTimeout(500);

        // Fill hours and minutes
        await this.page.getByRole("spinbutton", { name: "Hour" }).fill(startHour);
        await this.page.getByRole("spinbutton", { name: "Minute" }).fill("00");

        // Handle AM/PM toggle
        const amPmStart = this.page.locator(".flatpickr-am-pm").filter({ hasText: "AM" }).first();
        if (await amPmStart.isVisible({ timeout: 1500 }).catch(() => false)) {
          console.log("🟢 Start time: AM visible, skipping toggle.");
        } else {
          const genericToggle = this.page.locator(".flatpickr-am-pm").first();
          if (await genericToggle.isVisible({ timeout: 2000 }).catch(() => false)) {
            console.log("🔄 Toggling AM/PM for start time...");
            await genericToggle.click({ force: true });
          } else {
            console.warn("⚠️ AM/PM toggle not visible for start time — pressing ArrowUp on time box.");
            const amPmFallback = this.page.locator(
              ".flatpickr-calendar.hasTime.noCalendar.animate.open > .flatpickr-time > .flatpickr-am-pm"
            );
            if (await amPmFallback.isVisible().catch(() => false)) {
              await this.page.keyboard.press("ArrowUp");
            }
          }
        }

        await this.page.keyboard.press("Escape");

        // -------- END TIME --------
        const endInput = this.page
          .locator('.schedule-settings-box:has(h5:text("Game End At"))')
          .nth(i)
          .locator('input[formcontrolname="gameEndTime"]');
        await endInput.scrollIntoViewIfNeeded();
        await endInput.click({ force: true });
        await this.page.waitForTimeout(500);

        await this.page.getByRole("spinbutton", { name: "Hour" }).fill(endHour);
        await this.page.getByRole("spinbutton", { name: "Minute" }).fill("00");

        // Toggle AM/PM for end time
        const amPmEnd = this.page.locator(
          ".flatpickr-calendar.hasTime.noCalendar.animate.open > .flatpickr-time > .flatpickr-am-pm"
        );
        const currentText = (await amPmEnd.textContent())?.trim() ?? "";
        if (currentText !== endPeriod) {
          console.log(`🔁 Switching AM/PM from ${currentText} to ${endPeriod}...`);
          if (await amPmEnd.isVisible({ timeout: 2000 }).catch(() => false)) {
            await amPmEnd.click({ force: true });
            console.log("🖱️ AM/PM toggled via click");
          } else {
            console.warn("⚠️ AM/PM toggle not visible, toggling via keyboard...");
            const timeBox = this.page.locator(
              ".flatpickr-calendar.hasTime.noCalendar.animate.open > .flatpickr-time"
            );
            await timeBox.focus();
            await this.page.keyboard.press("ArrowUp");
            console.log("⌨️ AM/PM toggled using keyboard (ArrowUp)");
          }
        } else {
          console.log(`✅ End time AM/PM already set to ${endPeriod}.`);
        }

        await this.page.keyboard.press("Escape");
      }

      // -------- GAME LENGTH & TIME BETWEEN GAMES --------
      console.log("⚙️ Setting game length and time between games...");

      await expect(this.gameLengthInput).toBeVisible({ timeout: 5000 });
      await expect(this.timeBetweenGamesInput).toBeVisible({ timeout: 5000 });

      await this.gameLengthInput.fill("65");
      await this.timeBetweenGamesInput.fill("15");
      console.log("✅ Game length set to 65 minutes, time between games set to 15 minutes.");

      // -------- SAVE SETTINGS --------
      await expect(this.saveScheduleBtn).toBeVisible({ timeout: 5000 });
      await this.saveScheduleBtn.click({ force: true });

      await this.page.waitForTimeout(2000);

      const continueBtn = this.page.getByText("Tap anywhere to continue.");
      if (await continueBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
        await continueBtn.click({ force: true });
        console.log("✅ Schedule saved successfully (confirmation seen).");
      } else {
        console.warn("⚠️ No 'Tap anywhere to continue' popup found, continuing without it.");
      }
      await this.page.waitForTimeout(1500);


      await this.takeScreenshot(testInfo, "Schedule_FinalSettings.png", this.page);
      console.log("✅ Schedule times saved successfully!");

      await this.page.waitForTimeout(5000);
      console.log("─────────────────────────────────────────────");
    });
  }


  /* =========================================================
     COURT + SCHEDULE FLOW
  ========================================================== */

  async handleScheduleFlow(testInfo: TestInfo) {

    console.log("📅 Handling Schedule Section...");

    // IMPORTANT:
    // At this point we are already on Schedule screen
    // because we just clicked "Schedule Pool Games"
    // So DO NOT click Pool Play again

    // If schedule tab navigation is required, keep this.

    if (await this.navigateScheduleBtn.isVisible().catch(() => false)) {
      await this.navigateScheduleBtn.click({ force: true });
      await this.page.waitForTimeout(1500);
    }

    // Scroll to schedule table
    await this.page.locator("th", { hasText: "Time" }).scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(1000);

    // Clear any lingering popups before starting deletion process
    await this.tapAnywhereIfVisible();

    while (await this.deleteIconRed.count() > 0) {

      console.log("🗑 Deleting existing court...");

      await this.deleteIconRed.first().scrollIntoViewIfNeeded();
      await this.deleteIconRed.first().click();

      await expect(this.disableActionButton).toBeVisible({ timeout: 10000 });
      await this.disableActionButton.click();

      await this.tapAnywhereIfVisible();
      await this.page.waitForTimeout(800);
    }

    console.log("✅ All courts deleted.");

    // =====================================================
    // STEP 2: ADD NEW COURTS
    // =====================================================

    console.log("➕ Adding 2 new courts...");

    await this.showAddTournamentCourtBtn.click();

    await expect(this.courtCountInput).toBeVisible({ timeout: 10000 });
    await this.courtCountInput.fill("2");

    await this.createCourtBtn.click();

    await this.tapAnywhereIfVisible();
    await this.page.waitForTimeout(1500);

    console.log("✅ 2 courts created.");

    // Optional Refresh
    if (await this.refreshDataBtn.isVisible().catch(() => false)) {
      await this.refreshDataBtn.click();
      await this.page.waitForTimeout(2000);
    }

    // =====================================================
    // STEP 3: DRAG TEAMS TO 7:00 AM COURT 1
    // =====================================================

    console.log("🏀 Performing drag & drop...");

    // Freeze handles BEFORE any dragging
    const teamHandles = await this.page.locator('span.cdk-drag-handle').all();

    console.log(`✅ Found ${teamHandles.length} draggable teams.`);

    const targetCell = this.page
      .locator('tr')
      .filter({ has: this.page.locator('td:has-text("7:00 AM")') })
      .first()
      .locator('td')
      .nth(1);

    await expect(targetCell).toBeVisible({ timeout: 20000 });

    for (let i = 0; i < teamHandles.length; i++) {

      const handle = teamHandles[i];
      await expect(handle).toBeVisible({ timeout: 10000 });

      const sourceBox = await handle.boundingBox();
      const targetBox = await targetCell.boundingBox();

      if (!sourceBox || !targetBox) continue;

      console.log(`↪️ Dragging team ${i + 1}...`);

      await this.page.mouse.move(sourceBox.x + 10, sourceBox.y + 10);
      await this.page.mouse.down();
      await this.page.waitForTimeout(1500);

      // Activate CDK drag
      await this.page.mouse.move(sourceBox.x + 40, sourceBox.y + 40, { steps: 10 });
      await this.page.waitForTimeout(1500);

      await this.page.mouse.move(
        targetBox.x + targetBox.width / 2,
        targetBox.y + targetBox.height / 2,
        { steps: 25 }
      );

      await this.page.mouse.up();
      await this.page.waitForTimeout(2000);
      await this.takeScreenshot(testInfo, "Schedule_DragAndDrop.png", this.page);

      console.log(`✅ Team ${i + 1} dropped.`);
    }

    console.log("✅ Schedule Flow Completed.");
  }



  /* =========================================================
     BRACKET FLOW
  ========================================================== */

  async handleBracketFlow(testInfo: TestInfo) {

    await test.step("Bracket Flow", async () => {

      console.log("🏆 Opening Brackets...");

      await this.goBackBtn.click();
      await this.page.waitForTimeout(1000);

      await this.bracketsTabBtn.click();
      await this.page.waitForTimeout(2000);

      await this.deleteAllBracketsIfExist();

      console.log("➕ Creating Bracket...");
      await this.createBracketBtn.click();
      await this.tapAnywhereIfVisible();

      const bracketDropZone = this.page.locator('#bracket-0');
      await this.page.waitForTimeout(1500);

      await this.dragAllTeamsToTarget(
        '#teamsList div[cdkdrag]',
        bracketDropZone, testInfo
      );

      console.log("📅 Scheduling Bracket...");
      await this.scheduleBracketBtn.click();
      await this.page.waitForTimeout(1500);
      await this.tapAnywhereIfVisible();
      await this.page.waitForTimeout(1500);
      await this.handleScheduleFlow(testInfo);
      await this.page.waitForTimeout(4000);
      await this.takeScreenshot(testInfo, "Bracket_FinalSchedule.png", this.page);

      console.log("✅ Bracket Flow Completed.");
    });
  }

}
