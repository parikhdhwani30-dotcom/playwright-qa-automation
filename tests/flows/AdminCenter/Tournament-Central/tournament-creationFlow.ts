import { Page, expect, TestInfo } from "@playwright/test";
import { TournamentPage } from "../../../../pages/AdminCenter/Tournament-Central/tournament-creation-updation.page";
import path from "path";

export async function tournamentCreationFlow(
  page: Page,
  testInfo: TestInfo,
  type: "Team" | "Player"   // 👈 added third parameter here
) {
  const tournament = new TournamentPage(page);

  const tournamentName = `Hampers World Cup Tournament ${type}`;
  const updatedName = tournamentName + " Updated";

  // -------------------------------
  // Step 1: Create Tournament JIVA World Cup Tournament
  // -------------------------------
  await tournament.navigateToTournamentCentral();
  await tournament.fillTournamentForm(tournamentName, type);

  const waiverPath = path.resolve("files/Confidentiality Agreement.pdf");
  await tournament.handleWaiverUploads(type, waiverPath);

  if (type === "Team") {
    await tournament.configureTeamInformation();
  } else {
    await tournament.configurePlayerInformation();
  }

  await tournament.addLocation();


  await tournament.addProduct(
    "Golf",
    "This is a golf product",
    "40",
    "files/download.jpg",
    true
  );

  await tournament.addPriceOption(type);
  await tournament.publishTournament(testInfo);

  console.log(`✅ ${type} Tournament created: ${tournamentName}`);

  // -------------------------------
  // Step 2: Update Tournament (optional)
  // -------------------------------
  // await tournament.navigate();
  // await tournament.navigateToAnyModule("Tournament Central");
  // await tournament.openExistingTournament(tournamentName);
  // await tournament.updateTournamentForm(updatedName);
  // const updateWaiverPath = path.resolve("files/UpdatedConfidentialityAgreement.pdf");
  // await tournament.uploadWaiver(updateWaiverPath);
  // await tournament.nextClick();
  // await tournament.nextClick();
  // await tournament.nextClick();
  // await tournament.nextClick();
  // await tournament.updatePriceOption(type);
  // await tournament.publishUpdatedTournament(testInfo);
  // await expect(page.getByText("Tournament updated")).toBeVisible();
  // console.log(`✅ ${type} Tournament updated: ${updatedName}`);
}
