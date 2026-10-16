import { Page, test } from "@playwright/test";
import { TournamentManagePage } from "../../../../pages/AdminCenter/Tournament-Central/tournament-manage.page(new).ts";

export async function manageTournamentFlow(page: Page, tournamentName: string, testInfo?: any) {

  const managePage = new TournamentManagePage(page);

  await test.step("🔎 Open Tournament Manage Screen", async () => {

    await managePage.navigateToAdminCenter();
    await managePage.navigateToAnyModule("Tournament Central");
    await managePage.selectTournamentOrganization("HARdy");
    await managePage.openManageAndClickSettings(tournamentName);
  });

  await test.step("🏀 Execute Pool Play Flow", async () => {
    await managePage.handlePoolPlayFlow(testInfo);
  });

  await managePage.setScheduleTimes("07", "10", "PM", testInfo);

  await test.step("📅 Execute Schedule Flow (Courts + Drag)", async () => {
    await managePage.handleScheduleFlow(testInfo);
  });

  await test.step("🏆 Execute Bracket Flow", async () => {
    await managePage.handleBracketFlow(testInfo);
  });

  console.log("─────────────────────────────────────────────");
  console.log("✅ Manage Tournament Flow completed successfully!");
  console.log("─────────────────────────────────────────────");
}
