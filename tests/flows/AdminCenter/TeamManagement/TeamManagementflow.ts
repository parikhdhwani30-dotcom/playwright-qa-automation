import { Page, TestInfo } from '@playwright/test';
import { TeamManagementPage } from '../../../../pages/AdminCenter/TeamManagement/TeamManagementPage';

export async function teamManagementFlow(
  page: Page,
  testInfo: TestInfo
) {
  console.log('🚀 Starting Team Management Flow');

  const managementPage = new TeamManagementPage(page);

  // 🔹 Open tournament dynamically
  await managementPage.openTournamentFromAdmin('Designation');

  // 🔹 Add Coach
  await managementPage.addCoach(testInfo);

  // 🔹 Update Coach
  await managementPage.updateCoach(testInfo);

  // 🔹 Upload Roster
  await managementPage.uploadRoster(testInfo);

  // 🔹 Export Roster
  await managementPage.exportRoster(testInfo);



  // 🔹 Export Team Information
  await managementPage.exportTeamInformation(testInfo);

  // 🔹 Export Roster Documentation
  await managementPage.exportRosterDocumentation(testInfo);

  // 🔹 Export Team Information
  await managementPage.exportAllRegistrationData(testInfo);

  console.log('✅ Tournament Management Flow Completed');
}
