import { Page, test, TestInfo, Locator } from "@playwright/test";
import { BasePage } from "../baseFile";

export default class AddCommunityPage extends BasePage {
  // Locators
  readonly joinCommunityBtn: Locator;
  readonly codeInputs: Locator;
  readonly joinPrivateCommunityBtn: Locator;
  readonly joinCommunityBtnFinal: Locator;
  readonly tapToContinueMsg: Locator;
  readonly profileMenuBtn: Locator;
  readonly logoutBtn: Locator;
  readonly confirmLogoutBtn: Locator;

  constructor(page: Page) {
    super(page, "/sketchplay-dashboard");

    // Initialize Locators
    this.joinCommunityBtn = page.getByRole("button", { name: "join-community-btn" });
    this.codeInputs = page.locator('input[id^="otp_"]');
    this.joinPrivateCommunityBtn = page.getByRole("button", { name: "Join Private Community" });
    this.joinCommunityBtnFinal = page.getByRole("button", { name: "Join Community" });
    this.tapToContinueMsg = page.getByText("Tap anywhere to continue.");
    this.profileMenuBtn = page.locator('button:has-text("ML"), #dropdownMenuButton');
    this.logoutBtn = page.getByRole("button", { name: /Logout/i });
    this.confirmLogoutBtn = page.getByRole("button", { name: /Yes, Logout/i });
  }

  /** Clicks on "Add Community" and waits for input fields */
  async clickAddCommunity() {
    await test.step("Click Add Community", async () => {
      await this.joinCommunityBtn.click();
      await this.codeInputs.first().waitFor({ state: "attached", timeout: 10000 });
    });
  }

  /** Enters the 6-character community code */
  async enterCommunityCode(code: string) {
    await test.step(`Enter Community Code: ${code}`, async () => {
      await this.codeInputs.first().waitFor({ state: "visible", timeout: 10000 });

      const chars = code.split("");
      const count = await this.codeInputs.count();
      console.log(`🔢 Found ${count} input boxes for community code.`);

      for (let i = 0; i < count && i < chars.length; i++) {
        const input = this.codeInputs.nth(i);
        await input.click();
        await input.pressSequentially(chars[i]); // simulate real key press
        await this.page.waitForTimeout(100);
      }

      // 🔹 Trigger validation (enables button)
      await this.codeInputs.last().press("Tab");
      console.log("✅ Code entered & tab pressed to trigger validation.");

      // Wait for button to become enabled
      await this.page.waitForFunction(
        (btn) => btn && !btn.hasAttribute("disabled"),
        await this.joinPrivateCommunityBtn.elementHandle(),
        { timeout: 15000 }
      );

      console.log("🟢 Join Private Community button is enabled, clicking...");
      await this.joinPrivateCommunityBtn.click();

      // Small buffer after click
      await this.page.waitForTimeout(1500);
    });
  }

  /** Select a specific role and join */
  async selectRole(role: string, testInfo: TestInfo) {
    await test.step(`Select Role: ${role}`, async () => {
      await this.page.getByText(role, { exact: true }).click();
      await this.joinCommunityBtnFinal.click();
    });

    await this.page.waitForTimeout(3000);
    await this.takeScreenshot(testInfo, 'joinedCommunities.png');
    
    if (await this.tapToContinueMsg.isVisible({ timeout: 8000 }).catch(() => false)) {
      await this.tapToContinueMsg.click();
      await this.page.waitForTimeout(1000);
    }
  }

  /** Logs out current user */
  async logout() {
    await test.step("Logout", async () => {
      if (await this.profileMenuBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
        await this.profileMenuBtn.click();
      }
      await this.page.waitForTimeout(1000);
      await this.logoutBtn.click().catch(() => { });
      await this.confirmLogoutBtn.click().catch(() => { });
      await this.page.waitForTimeout(1500);
    });
  }
}
