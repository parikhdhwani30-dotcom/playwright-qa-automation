import { Page, test, expect, TestInfo, Locator } from "@playwright/test";
import { BasePage } from "../baseFile";

/**
 * Page Object for handling user registration flow.
 * Encapsulates all actions related to filling and submitting the registration form.
 */
export default class RegisterPage extends BasePage {
  // Locators
  readonly registerLink: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly mobileInput: Locator;
  readonly termsCheckbox: Locator;
  readonly choosePasswordBtn: Locator;
  readonly tapToContinueMsg: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly enterSecurityCodeBtn: Locator;
  readonly otpInputs: Locator;
  readonly completeRegistrationBtn: Locator;
  readonly popupDismissBtn: Locator;

  constructor(page: Page) {
    super(page, "/"); // homepage or registration page base URL

    // Initialize Locators
    this.registerLink = page.locator('#registerLink');
    this.firstNameInput = page.locator('#signupFirstName');
    this.lastNameInput = page.locator('#signupLastName');
    this.emailInput = page.locator('#signupEmail');
    this.mobileInput = page.locator('#signupMobile');
    this.termsCheckbox = page.locator('label div.w-\\[22px\\]');
    this.choosePasswordBtn = page.locator('#choosePasswordBtn');
    this.tapToContinueMsg = page.getByText("Tap anywhere to continue.");
    this.passwordInput = page.locator('#signupPassword');
    this.confirmPasswordInput = page.locator('#signupConfirmPassword');
    this.enterSecurityCodeBtn = page.locator('#enterSecurityCodeBtn');
    this.otpInputs = page.locator('input[id^="otp_"]');
    this.completeRegistrationBtn = page.locator('#completeRegistrationBtn');
    this.popupDismissBtn = page.locator('#announcementPopup button[dismissmodal]');
  }

  /**
   * Click on "Register Here" to start the registration flow.
   */
  async clickRegisterHere() {
    await test.step("Click Register Here", async () => {
      // 🧩 Wait for the page or modal reload (the UI reload happens here)
      console.log("🔄 Waiting for page reload after Add Price Option...");
      await this.page.waitForLoadState("networkidle", { timeout: 15000 });
      await this.registerLink.click({ force: true });
    });
  }

  /**
   * Fill in all user registration details (name, email, mobile).
   */
  async fillUserDetails(
    first: string,
    last: string,
    email: string,
    mobile: string
  ) {
    await test.step("Fill user details", async () => {
      await this.firstNameInput.fill(first);
      await this.lastNameInput.fill(last);
      await this.emailInput.fill(email);
      await this.mobileInput.fill(mobile);
    });
  }

  async acceptTerms() {
    await test.step("Accept Terms", async () => {
      await this.termsCheckbox.click();
    });
  }


  /**
   * Choose and confirm a password.
   */
  async setPassword(password: string) {
    await test.step("Set Password", async () => {
      await this.choosePasswordBtn.click();
      await this.tapToContinueMsg.click();
      await this.page.waitForTimeout(500); // small buffer
      await this.passwordInput.fill(password);
      await this.page.waitForTimeout(500); // small buffer
      await this.confirmPasswordInput.fill(password);
      await this.page.waitForTimeout(1000); // small buffer 
      await this.enterSecurityCodeBtn.click();
      await this.page.waitForTimeout(500); // small buffer
      await this.tapToContinueMsg.click();
      await this.page.waitForTimeout(1500); // small buffer
    });
  }

  /**
   * Enter OTP for security verification.
   */
  async enterOTP(otp: string) {
    console.log("📩 Entering OTP...");

    await this.otpInputs.first().waitFor({ state: "visible", timeout: 10000 });

    const count = await this.otpInputs.count();
    console.log(`📩 Found ${count} OTP input boxes.`);

    // Split OTP digits
    const digits = otp.split("");
    for (let i = 0; i < count && i < digits.length; i++) {
      const input = this.otpInputs.nth(i);
      await input.click();
      await input.pressSequentially(digits[i]); // type instead of fill
      await this.page.waitForTimeout(100);
    }

    // 🔹 Fire blur / tab event to simulate human input
    await this.otpInputs.last().press("Tab");
    console.log("✅ OTP entered & tab pressed to trigger validation.");

    // Optional short wait for button to enable
    await this.page.waitForTimeout(1500);
  }

  /**
   * Complete the registration process and close the final popup if present.
   */
  async completeRegistration(testInfo: TestInfo) {
    console.log("🕓 Waiting for Complete Registration button...");

    await this.completeRegistrationBtn.waitFor({ state: 'visible' });
    await this.completeRegistrationBtn.click();

    // ⏳ Small wait to allow transitions / popup rendering
    await this.page.waitForTimeout(2500);

    await this.takeScreenshot(testInfo, 'resitration.png');

    // ✅ Click "Tap anywhere to continue."
    if (await this.tapToContinueMsg.isVisible({ timeout: 10000 }).catch(() => false)) {
      await this.tapToContinueMsg.click();
      console.log('🔹 Clicked "Tap anywhere to continue."');
      await this.page.waitForTimeout(2500); // wait for popup to appear
    }

    // ✅ Optional announcement popup click (if visible)
    if (await this.popupDismissBtn.isVisible({ timeout: 7000 }).catch(() => false)) {
      await this.popupDismissBtn.click({ force: true });
      console.log("✅ Announcement popup clicked successfully.");
    } else {
      console.log("ℹ️ No announcement popup detected.");
    }

    //  ✅ Small transition wait
    await this.page.waitForTimeout(1000);
  }
}
