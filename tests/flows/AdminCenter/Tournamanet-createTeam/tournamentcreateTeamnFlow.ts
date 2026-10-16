import { Page, TestInfo, expect } from "@playwright/test";
import { TournamentCreateTeamPage } from "../../../../pages/AdminCenter/Tournamanet-createTeam/tournament-createTeam.page";

export async function tournamentCreaeteTeamFlow(
  page: Page,
  testInfo: TestInfo
) {
  const register = new TournamentCreateTeamPage(page);

  // Step 1: Navigate to the page and select tournament organization
  console.log("🏁 Navigating to Tournament Central...");
  await register.navigateToAdminCenter();
  await register.navigateToAnyModule("Tournament Central");
  await register.selectTournamentOrganization("HARdy");

  // Step 2: Open tournament dynamically
  console.log("🎯 Opening selected tournament...");

  await register.navigateAndOpenTournament("Duplicate Player Automation");


  // Step 3: Create teams dynamically for each division
  console.log("🎮 Creating teams dynamically...");
  await register.createTeamsForAllDivisions(testInfo);

  // Step 4: Verify the Auto-Remove Player toggle functionality
  console.log("🔧 Verifying Auto-Remove Player toggle...");
  await register.verifyAutoRemovePlayerToggle(testInfo);

  console.log("✅ Tournament Registration flow completed successfully!");
}
