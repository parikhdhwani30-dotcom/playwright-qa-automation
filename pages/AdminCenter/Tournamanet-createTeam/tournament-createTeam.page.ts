import { Locator, Page, TestInfo, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { BasePage } from "../../baseFile";
import { attachScreenshot } from "../../../utils/allureScreenshot";

export class TournamentCreateTeamPage extends BasePage {

  // Locators
  readonly registrationCell: Locator;
  readonly createTeamButton: Locator;
  readonly divisionDropdown: Locator;
  readonly divisionOptions: Locator;
  readonly teamNameInput: Locator;
  readonly saveTeamButton: Locator;
  readonly confirmMessagePopup: Locator;

  readonly toggleContainer: Locator;
  readonly toggleInput: Locator;
  readonly toggleSwitch: Locator;
  readonly playerItems: Locator;
  readonly targetDropLists: Locator;

  constructor(page: Page) {
    super(page, "/admin-center");

    // Initialize Locators
    this.registrationCell = page.locator('datatable-body-cell span.text-blue-500').filter({ hasText: /^\d+$/ });
    this.createTeamButton = page.locator("button", { hasText: "Create Team" });
    this.divisionDropdown = page.locator('ng-select:has-text("Select division")').first();
    this.divisionOptions = page.locator('div[role="option"]');
    this.teamNameInput = page.getByRole("textbox", { name: "Enter Team Name" });
    this.saveTeamButton = page.getByRole("button", { name: "Save Team" });
    this.confirmMessagePopup = page.getByText("Tap anywhere to continue.");

    this.toggleContainer = page.locator('label').filter({ hasText: 'Auto-Remove Player from List' });
    this.toggleInput = this.toggleContainer.locator('input[type="checkbox"]');
    this.toggleSwitch = this.toggleContainer.locator('div').first();
    this.playerItems = page.locator("#players .cdk-drag");
    this.targetDropLists = page.locator(".cdk-drop-list:has(.ri-edit-2-fill)");
  }


  async navigateAndOpenTournament(tournamentName: string) {
    console.log("─────────────────────────────────────────────");
    console.log(`🏁 Navigating to Tournament Central → ${tournamentName}`);

    // Search tournament
    await this.searchUser(tournamentName);

    await this.page.waitForTimeout(2000);


    // Optional: registration cell (Strictly click on the cell containing only digits and blue underlined text)
    await this.registrationCell.first().click({ force: true });
    await this.page.waitForLoadState('domcontentloaded');
  }



  async createTeamsForAllDivisions(testInfo: TestInfo) {
    console.log("─────────────────────────────────────────────");
    console.log("🧩 Creating one team for each division option...");
    await this.page.waitForTimeout(400);
    // Step 1: Click on "Create Team" button
    await expect(this.createTeamButton).toBeVisible({ timeout: 15000 });
    await this.createTeamButton.click();
    console.log("✅ 'Create Team' button clicked.");

    // Step 2: Locate the division dropdown
    await expect(this.divisionDropdown).toBeVisible({ timeout: 10000 });

    // Step 3: Count available divisions (open once)
    await this.divisionDropdown.click();
    await this.page.waitForSelector('div[role="option"]', { state: "visible", timeout: 5000 });
    const totalDivisions = await this.divisionOptions.count();
    console.log(`✅ Total divisions available: ${totalDivisions}`);

    if (totalDivisions === 0) {
      console.warn("⚠️ No division options found!");
      return;
    }

    // Step 4: Loop through all division options one by one
    for (let i = 0; i < totalDivisions; i++) {
      console.log(`➡️ Handling Division ${i + 1} of ${totalDivisions}`);

      // 🧩 Ensure dropdown is closed before reopening (to prevent toggle-close bug)
      await this.page.keyboard.press("Escape");
      await this.page.waitForTimeout(300);

      // Now safely open it
      await this.divisionDropdown.click();
      await this.page.waitForSelector('div[role="option"]', { state: "visible", timeout: 5000 });

      const divisionOption = this.divisionOptions.nth(i);
      const divisionName = (await divisionOption.textContent())?.trim() || `Division${i + 1}`;

      // ✅ Select the option
      await divisionOption.click({ force: true });
      console.log(`✅ Selected Division: ${divisionName}`);

      // Wait for dependent dropdowns/UI updates
      await this.page.waitForTimeout(600);

      // Step 5: Fill Team Name
      const teamName = `${divisionName.replace(/\s+/g, '')}_${faker.word.noun()}${faker.number.int({ min: 10, max: 99 })}`;
      await this.teamNameInput.fill(teamName);
      console.log(`📝 Entered Team Name: ${teamName}`);

      // Step 6: Save Team
      await this.saveTeamButton.click();
      console.log(`💾 Saved team: ${teamName}`);

      await this.page.waitForTimeout(1500);
      await attachScreenshot(this.page, testInfo, `Saved-Team-${teamName}`);


      // Step 7: Handle confirmation popup
      await this.confirmMessagePopup.waitFor({ state: "visible", timeout: 30000 });
      await this.confirmMessagePopup.click();
      console.log("✅ Confirmation popup handled.");

      // Small delay between divisions
      await this.page.waitForTimeout(800);
    }
    await this.page.reload({ waitUntil: 'networkidle' });
    console.log("✅ All division teams created successfully!");
  }


  async verifyAutoRemovePlayerToggle(testInfo: TestInfo) {
    console.log("─────────────────────────────────────────────");
    console.log("🎯 Verifying Auto-Remove toggle, performing robust drag, and checking player list...");

    // 2️⃣ Find toggle elements
    await expect(this.toggleContainer).toBeVisible({ timeout: 10000 });

    // Detect current toggle state
    let isToggleOn = false;
    if (await this.toggleInput.count()) {
      isToggleOn = await this.toggleInput.isChecked();
    } else {
      const toggleClass = await this.toggleSwitch.getAttribute('class');
      isToggleOn = !!(
        toggleClass?.includes('bg-[#3B82F6]') ||
        toggleClass?.includes('active') ||
        toggleClass?.includes('checked')
      );
    }

    // If toggle is ON, turn it OFF before drag
    if (isToggleOn) {
      console.log("🟢 Toggle is ON → turning it OFF before drag...");
      await this.page.waitForTimeout(1000);
      await this.toggleSwitch.click({ force: true });
      await this.page.waitForTimeout(1000);
      try {
        await this.confirmMessagePopup.waitFor({ state: "visible", timeout: 5000 });
        await this.page.waitForTimeout(1000);
        await this.confirmMessagePopup.click();
        console.log("✅ Popup appeared and clicked.");
      } catch {
        await this.page.waitForTimeout(1000);
        console.log("ℹ️ No popup appeared, continuing...");
      }
      await this.page.waitForTimeout(1000); // Allow some time for the toggle to complete
      isToggleOn = false;
    } else {
      await this.page.waitForTimeout(1000);
      console.log("⚪ Toggle already OFF → proceeding with drag.");
    }

    await this.page.waitForTimeout(1000);

    // 3️⃣ Get players
    await expect(this.playerItems.first()).toBeVisible({ timeout: 10000 });
    const playerCountBefore = await this.playerItems.count();
    if (playerCountBefore < 1) throw new Error("❌ Need at least 1 player to verify removal.");
    console.log(`👥 Player count before drag: ${playerCountBefore}`);

    await this.page.waitForTimeout(1000);
    await attachScreenshot(this.page, testInfo, 'Player-Count-Before-Drag');


    // Pick the first player to move
    const firstPlayer = this.playerItems.first();
    const rawPlayerText = (await firstPlayer.textContent())?.trim() ?? "";
    const playerName = rawPlayerText.split('\n')[0].trim() || rawPlayerText || "Unknown Player";
    console.log(`🎮 Will attempt to move player: "${playerName}"`);

    // 4️⃣ Drag player logic refactored
    await this.dragPlayerToLastTeam(firstPlayer, playerName);

    // 5️⃣ Turn toggle ON after drag to remove player
    if (!isToggleOn) {
      console.log("🔘 Turning Auto-Remove toggle ON after drag to remove player from list...");
      await this.toggleSwitch.click({ force: true });
      try {
        await this.confirmMessagePopup.waitFor({ state: "visible", timeout: 5000 });
        await this.confirmMessagePopup.click();
      } catch {
        console.log("ℹ️ No popup appeared after toggle ON.");
      }
      await this.page.waitForTimeout(500);
    }
    await this.page.reload({ waitUntil: 'networkidle' });
    // 6️⃣ Wait until player disappears from source list using locators (no querySelectorAll!)
    try {
      await this.playerItems.filter({ hasText: playerName }).waitFor({ state: "detached", timeout: 12000 });
    } catch {
      console.warn(`⚠️ Player "${playerName}" did not disappear from list within timeout, check app logic.`);
    }


    // 7️⃣ Final reporting
    const playerCountAfter = await this.playerItems.count();
    console.log(`👥 Player count after toggle ON: ${playerCountAfter}`);

    await this.page.waitForTimeout(1000);
    await attachScreenshot(this.page, testInfo, 'Player-Count-After-Toggle-ON');


    if (playerCountBefore > playerCountAfter) {
      console.log("✅ Auto-Remove worked: available player list decreased.");
    } else {
      console.warn("⚠️ Auto-Remove did NOT remove the player from available list.");
    }


    // 8️⃣ Drag another player after toggle is ON
    console.log("─────────────────────────────────────────────");
    console.log("🎯 Dragging a second player with Auto-Remove Toggle ON...");

    const remainingCount = await this.playerItems.count();

    if (remainingCount < 1) {
      console.warn("⚠️ No remaining players to drag for the second test.");
    } else {
      const secondPlayer = this.playerItems.first();
      const rawSecondPlayerText = (await secondPlayer.textContent())?.trim() ?? "";
      const secondPlayerName = rawSecondPlayerText.split('\n')[0].trim() || rawSecondPlayerText || "Unknown Player";
      console.log(`🎮 Will attempt to move second player: "${secondPlayerName}"`);

      try {
        await this.dragPlayerToLastTeam(secondPlayer, secondPlayerName);

        // 9️⃣ Wait until second player disappears from source list (because toggle is ON)
        try {
          await this.playerItems.filter({ hasText: secondPlayerName }).waitFor({ state: "detached", timeout: 12000 });
          console.log(`✅ Second player "${secondPlayerName}" automatically removed from list after drag.`);

          await this.page.waitForTimeout(1000);
          await attachScreenshot(this.page, testInfo, 'Second-Player-Auto-Removed');
        } catch {
          console.warn(`⚠️ Second player "${secondPlayerName}" did not disappear from list within timeout.`);
        }
      } catch (err: any) {
        throw new Error(`Failed to drag second player: ${err.message}`);
      }
    }

    console.log("─────────────────────────────────────────────");
  }

  /**
   * Helper function to robustly drag a given player locator to the 
   * last team container (newly created team).
   */
  async dragPlayerToLastTeam(playerLocator: Locator, playerName: string) {
    const currentTargetRow = this.targetDropLists.last().locator('div.flex.items-center').first();

    await playerLocator.scrollIntoViewIfNeeded({ timeout: 5000 });
    await currentTargetRow.scrollIntoViewIfNeeded({ timeout: 5000 });
    await playerLocator.hover();

    const srcBox = await playerLocator.boundingBox();
    const tgtBox = await currentTargetRow.boundingBox();

    if (!srcBox || !tgtBox) {
      throw new Error("Could not find source or target drop areas.");
    }

    const srcCenter = { x: srcBox.x + srcBox.width / 2, y: srcBox.y + srcBox.height / 2 };
    const tgtCenter = { x: tgtBox.x + tgtBox.width / 2, y: tgtBox.y + tgtBox.height / 2 };

    console.log(`🎮 Dragging "${playerName}" from (${srcCenter.x.toFixed(0)},${srcCenter.y.toFixed(0)}) → (${tgtCenter.x.toFixed(0)},${tgtCenter.y.toFixed(0)})`);

    await this.page.mouse.move(srcCenter.x, srcCenter.y);
    await this.page.mouse.down();
    await this.page.waitForTimeout(200);

    // First move to the original target coordinates
    await this.page.mouse.move(tgtCenter.x, tgtCenter.y, { steps: 25 });

    // ⏳ WAIT for CDK drag sorting animations
    await this.page.waitForTimeout(500);

    // Re-calculate the target's NEW position after it was pushed down
    const updatedTgtBox = await currentTargetRow.boundingBox();
    if (updatedTgtBox) {
      const updatedTgtCenter = { x: updatedTgtBox.x + updatedTgtBox.width / 2, y: updatedTgtBox.y + updatedTgtBox.height / 2 };
      console.log(`🎮 Re-adjusting drag position to new target center: (${updatedTgtCenter.x.toFixed(0)},${updatedTgtCenter.y.toFixed(0)})`);
      await this.page.mouse.move(updatedTgtCenter.x, updatedTgtCenter.y, { steps: 10 });
    }

    await this.page.waitForTimeout(200);
    await this.page.mouse.up();
    await this.page.waitForTimeout(800); // Ensure element is fully dropped
  }

}
