import { Page, TestInfo } from '@playwright/test';
import { CustomTeamManagementPage } from '../../../../pages/AdminCenter/Tournamanet-createTeam/customTeamManagement.page';
import { TeamManagementPage } from '../../../../pages/AdminCenter/TeamManagement/team-management.page';

export async function customTeamManagementFlow(
    page: Page,
    testInfo: TestInfo
) {
    console.log('🚀 Starting Custom Team Management Flow');

    const customTeamPage = new CustomTeamManagementPage(page);
    const managementPage = new TeamManagementPage(page);

    // 🔹 Open the last created custom team
    await customTeamPage.openLastCustomCreatedTeam();

    // 🔹 Add Coach
    await managementPage.addCoach(testInfo);

    // 🔹 Update Coach
    await managementPage.updateCoach(testInfo);

    // 🔹 Export Coaches
    await managementPage.exportCoach(testInfo);

    // 🔹 Export Roster
    await managementPage.exportRoster(testInfo);

    console.log('✅ Custom Team Management Flow Completed');
}
