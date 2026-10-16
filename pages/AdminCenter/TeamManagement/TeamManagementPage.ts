import { Page, TestInfo, Locator } from '@playwright/test';
import path from 'path';
import { faker } from '@faker-js/faker';
import { BasePage } from '../../baseFile';
import { attachScreenshot } from '../../../utils/allureScreenshot';

export class TeamManagementPage extends BasePage {

  // Search & Navigation Locators
  readonly tournamentFirstResult: Locator;
  readonly searchBox: Locator;
  readonly matchingTournamentCell: Locator;

  // Coach Locators
  readonly addCoachBtn: Locator;
  readonly coachFirstNameInput: Locator;
  readonly coachLastNameInput: Locator;
  readonly coachEmailInput: Locator;
  readonly coachPhoneInput: Locator;
  readonly editCoachBtn: Locator;
  readonly submitAddCoachBtn: Locator;
  readonly tapAnywherePopup: Locator;

  // Roster Locators
  readonly uploadRosterBtn: Locator;
  readonly exportBtns: Locator;
  readonly exportCoaches: Locator;
  readonly viewDocsBtn: Locator;
  readonly exportRosterDocumentsLightBtn: Locator;

  // Team Info Locators
  readonly exportTeamInfoBtn: Locator;

  // Registration Data Locators
  readonly viewAllRegistrationDataBtn: Locator;
  readonly exportInfoBtn: Locator;
  readonly backBtn: Locator;

  constructor(page: Page) {
    super(page);

    // Initialize Locators
    this.tournamentFirstResult = page.locator('datatable-body-cell span.text-blue-500').filter({ hasText: /^\d+$/ });
    this.searchBox = page.getByRole('textbox', { name: 'Search...' });
    this.matchingTournamentCell = page.getByRole('cell', { name: new RegExp("Porro", 'i') }).locator('div');

    this.addCoachBtn = page.locator('#tm_add_coach_btn');
    this.coachFirstNameInput = page.locator('#tm_coach_first_name_input');
    this.coachLastNameInput = page.locator('#tm_coach_last_name_input');
    this.coachEmailInput = page.locator('#tm_coach_email_input');
    this.coachPhoneInput = page.locator('#tm_coach_phone_input');
    this.editCoachBtn = page.locator('[id^="tm_edit_coach_btn_"]');
    this.submitAddCoachBtn = page.locator('#tm_save_coach_btn');
    this.tapAnywherePopup = page.getByText('Tap anywhere to continue.');

    this.uploadRosterBtn = page.getByRole('button', { name: /Upload/i });
    this.exportBtns = page.locator('#tm_export_roster_btn');
    this.exportCoaches = page.locator('#tm_export_coaches_btn');
    this.viewDocsBtn = page.locator('#tm_view_docs_btn');
    this.exportRosterDocumentsLightBtn = page.locator('#vrd_roster_docs_btn');

    this.exportTeamInfoBtn = page.locator('#tm_export_team_info_btn');

    this.viewAllRegistrationDataBtn = page.locator('#tm_view_reg_data_btn');
    this.exportInfoBtn = page.locator('#rdr_export_btn');
    this.backBtn = page.getByRole('button', { name: /Back/i });
  }

  /* ------------------------------------ */
  /* Open Tournament from Admin Center    */
  /* ------------------------------------ */

  async openTournamentFromAdmin(searchText: string) {
    await this.page.waitForTimeout(2000);

    // Navigate to Admin Center
    await this.navigateToAdminCenter();

    // Click on Tournament Central module
    await this.navigateToAnyModule('Tournament Central');

    // Search for tournament
    await this.searchUser(searchText);

    await this.page.waitForTimeout(2000);

    // Open first result dynamically
    await this.tournamentFirstResult.first().click();

    await this.page.waitForLoadState('domcontentloaded');

    // 1️⃣ Click search textbox
    await this.searchBox.first().click();
    await this.page.waitForTimeout(1000);

    // 2️⃣ Fill search dynamically
    await this.searchBox.first().fill("Porro");

    // wait for filtering
    await this.page.waitForTimeout(2000);

    // 3️⃣ Click matching tournament cell dynamically
    await this.matchingTournamentCell.first().click();

    await this.page.waitForLoadState('domcontentloaded');
  }

  /* ------------------------------------ */
  /* Add Coach                            */
  /* ------------------------------------ */

  async addCoach(testInfo: TestInfo) {
    const randomFirstName = faker.person.firstName();
    const randomLastName = faker.person.lastName();
    const unique = Date.now().toString().slice(-4);

    // Generate an email like robert_williams_4592@yopmail.com
    const email = `${randomFirstName.toLowerCase()}_${randomLastName.toLowerCase()}_${unique}@yopmail.com`;

    // Generate a random US phone number: (XXX) XXX-XXXX
    const phone = `(${faker.string.numeric(3)}) ${faker.string.numeric(3)}-${faker.string.numeric(4)}`;

    await this.page.waitForTimeout(1000);

    await this.addCoachBtn.click();

    await this.coachFirstNameInput.fill(randomFirstName);
    await this.coachLastNameInput.fill(randomLastName);
    await this.coachEmailInput.fill(email);
    await this.coachPhoneInput.fill(phone);

    await this.page.waitForTimeout(1000);

    await this.submitAddCoachBtn.click();

    await this.page.waitForTimeout(1000);

    await attachScreenshot(this.page, testInfo, 'Coach-Added');

    await this.tapAnywherePopup.click();
  }

  /* ------------------------------------ */
  /* Update Coach                         */
  /* ------------------------------------ */

  async updateCoach(testInfo: TestInfo) {
    await this.page.waitForTimeout(1000);

    // Click on the first edit coach button
    await this.editCoachBtn.first().click();

    await this.page.waitForTimeout(1000);

    // Get current values
    const currentFirstName = await this.coachFirstNameInput.inputValue();
    const currentLastName = await this.coachLastNameInput.inputValue();
    const currentEmail = await this.coachEmailInput.inputValue();

    // Append _updated
    await this.coachFirstNameInput.fill(`${currentFirstName}_updated`);
    await this.coachLastNameInput.fill(`${currentLastName}_updated`);

    if (currentEmail.includes('@')) {
      const parts = currentEmail.split('@');
      await this.coachEmailInput.fill(`${parts[0]}_updated@${parts[1]}`);
    } else {
      await this.coachEmailInput.fill(`${currentEmail}_updated`);
    }

    // Change phone number
    const newPhone = `(${faker.string.numeric(3)}) ${faker.string.numeric(3)}-${faker.string.numeric(4)}`;
    await this.coachPhoneInput.fill(newPhone);

    await this.page.waitForTimeout(1000);

    await this.submitAddCoachBtn.click();

    await this.page.waitForTimeout(1000);

    await attachScreenshot(this.page, testInfo, 'Coach-Updated');

    await this.tapAnywherePopup.click();
  }

  /* ------------------------------------ */
  /* Upload Roster                        */
  /* ------------------------------------ */

  async uploadRoster(testInfo: TestInfo) {
    const filePath = path.resolve('files/roster-template.xlsx');

    const fileChooserPromise = this.page.waitForEvent('filechooser');
    await this.uploadRosterBtn.click();
    const fileChooser = await fileChooserPromise;

    await fileChooser.setFiles(filePath);

    await this.page.waitForTimeout(1000);

    await this.tapAnywherePopup.click();

    await this.page.waitForTimeout(1000);

    await attachScreenshot(this.page, testInfo, 'Roster-Uploaded');

    console.log(`✅ Roster uploaded`);
  }

  /* ------------------------------------ */
  /* Export Roster                        */
  /* ------------------------------------ */

  async exportCoach(testInfo: TestInfo) {

    // 🔹 Scroll to bottom properly
    await this.page.mouse.wheel(0, 5000);
    await this.page.waitForTimeout(500);

    // 🔹 Get ALL Export buttons
    // 🔹 Click the LAST one (bottom one)
    const targetExport = this.exportCoaches.last();

    await targetExport.waitFor({ state: 'visible', timeout: 10000 });

    const downloadPromise = this.page.waitForEvent('download');

    await targetExport.click({ force: true });

    const download = await downloadPromise;

    const savePath = path.resolve(`downloads/coaches_${download.suggestedFilename().trim()}`);
    await download.saveAs(savePath);

    console.log(`✅ Coaches Exported: ${savePath}`);

    await attachScreenshot(this.page, testInfo, 'Coaches-Exported');
  }

  /* ------------------------------------ */
  /* Export Roster                        */
  /* ------------------------------------ */

  async exportRoster(testInfo: TestInfo) {

    // 🔹 Scroll to bottom properly
    await this.page.mouse.wheel(0, 5000);
    await this.page.waitForTimeout(500);

    // 🔹 Get ALL Export buttons
    // 🔹 Click the LAST one (bottom one)
    const targetExport = this.exportBtns.last();

    await targetExport.waitFor({ state: 'visible', timeout: 10000 });

    const downloadPromise = this.page.waitForEvent('download');

    await targetExport.click({ force: true });

    const download = await downloadPromise;

    const savePath = path.resolve(`downloads/roster_${download.suggestedFilename().trim()}`);
    await download.saveAs(savePath);

    console.log(`✅ Roster Exported: ${savePath}`);

    await attachScreenshot(this.page, testInfo, 'Roster-Exported');
  }

  /* ------------------------------------ */
  /* Export Roster Documentation          */
  /* ------------------------------------ */


  async exportRosterDocumentation(testInfo: TestInfo) {

    await this.page.waitForTimeout(1000); // Wait for page to load
    // 🔹 Click View Docs Button

    await this.viewDocsBtn.click({ force: true });

    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(2000); // Wait for page to load

    // 🔹 Prepare download listener BEFORE clicking export
    const downloadPromise = this.page.waitForEvent('download');

    // 🔹 Click Roster Documents Export Button
    await this.exportRosterDocumentsLightBtn.click({ force: true });

    const download = await downloadPromise;

    const savePath = path.resolve(`downloads/roster_docs_${download.suggestedFilename().trim()}`);
    await download.saveAs(savePath);

    console.log(`✅ Roster Documents Exported: ${savePath}`);

    await attachScreenshot(this.page, testInfo, 'RosterDocuments-Exported');


    await this.tapAnywherePopup.click();

    await this.page.waitForTimeout(1000);

    // 🔹 Click Back button
    await this.backBtn.click({ force: true });

    await this.page.waitForLoadState('domcontentloaded');
  }

  /* ------------------------------------ */
  /* Export Team Information              */
  /* ------------------------------------ */

  async exportTeamInformation(testInfo: TestInfo) {
    const downloadPromise = this.page.waitForEvent('download');

    await this.exportTeamInfoBtn.click();

    const download = await downloadPromise;
    const savePath = path.resolve(`downloads/team_info_${download.suggestedFilename().trim()}`);
    await download.saveAs(savePath);

    console.log(`✅ Team Info Exported: ${savePath}`);

    await attachScreenshot(this.page, testInfo, 'Team-Information-Exported');
  }

  //  View All Registration date Export

  async exportAllRegistrationData(testInfo: TestInfo) {

    // 🔹 Click View All Registration Data
    await this.viewAllRegistrationDataBtn.click({ force: true });

    await this.page.waitForLoadState('domcontentloaded');

    // 🔹 Prepare download listener BEFORE clicking export
    const downloadPromise = this.page.waitForEvent('download');

    // 🔹 Click Export Info
    await this.exportInfoBtn.click({ force: true });

    const download = await downloadPromise;

    const savePath = path.resolve(`downloads/registration_${download.suggestedFilename().trim()}`);
    await download.saveAs(savePath);

    console.log(`✅ Registration Data Exported: ${savePath}`);

    await attachScreenshot(this.page, testInfo, 'RegistrationData-Exported');

    // 🔹 Click Back button
    await this.backBtn.click({ force: true });

    await this.page.waitForLoadState('domcontentloaded');
  }

}
