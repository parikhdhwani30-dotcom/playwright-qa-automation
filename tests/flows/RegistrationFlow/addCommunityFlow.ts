import { Page } from "@playwright/test";
import { registrationFlow } from "./registerFlow";
import AddCommunityPage from "../../../pages/RegistrationPage/addCommunityPage";

export async function addCommunityFlow(page: Page, testInfo: any) {
  const roleCodeMap: Record<string, string> = {
    Parent: "MOB444",
    Athlete: "BALLER",
    Coach: "UATSAN",
    Manager: "RAMBO1",
  };

  const addCommunityPage = new AddCommunityPage(page);

  for (const [role, code] of Object.entries(roleCodeMap)) {
    console.log(`\n🚀 Starting registration + join flow for role: ${role} (code: ${code})`);

    // Step 1. Register new user (and handle popup inside)
    await registrationFlow(page, testInfo);

    // Step 2. Add community and join
    await addCommunityPage.clickAddCommunity();
    await addCommunityPage.enterCommunityCode(code);
    await addCommunityPage.selectRole(role, testInfo);

    console.log(`✅ Joined community as ${role}`);

    // Step 3. Logout
    await addCommunityPage.logout();
    console.log(`👋 Logged out (${role})`);

    // Step 4. Wait + reload for next role
    await page.waitForTimeout(2000);
    await page.reload({ waitUntil: "domcontentloaded" });
  }
}
