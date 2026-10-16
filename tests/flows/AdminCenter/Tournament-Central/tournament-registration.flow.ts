import { Page, TestInfo } from "@playwright/test";
import { TournamentRegistrationPage } from "../../../../pages/AdminCenter/Tournament-Central/tournament-registration.page";

export async function tournamentRegistrationFlow(
  page: Page,
  testInfo: TestInfo,
  type: "Team" | "Player"
) {
  const registration = new TournamentRegistrationPage(page);
  const tournamentName = `Hampers World Cup Tournament ${type}`;

  await registration.navigateToAdminCenter();

  await registration.navigateToAnyModule("Tournament Central");
  // Search tournament
  await registration.searchUser(tournamentName);
  const popup = await registration.openRegistrationPopup(tournamentName);

  if (type === "Team") {
    await registration.registerTeam(popup, testInfo);
  } else {
    await registration.registerPlayer(popup, testInfo);
  }

  await popup.getByRole("button", { name: "Close Window" }).click();
  console.log(`✅ ${type} Tournament registration completed`);
}
