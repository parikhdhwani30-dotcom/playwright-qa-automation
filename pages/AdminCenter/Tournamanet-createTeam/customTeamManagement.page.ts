import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "../../baseFile";

export class CustomTeamManagementPage extends BasePage {
    constructor(page: Page) {
        super(page, "/admin-center");
    }

    /**
     * Clicks on the last custom created team from the drag-and-drop list.
     */
    async openLastCustomCreatedTeam() {
        console.log("─────────────────────────────────────────────");
        console.log("🎯 Opening the last custom created team...");

        // Locate the last team box that has the edit icon
        const teamDropLists = this.page.locator(".cdk-drop-list:has(.ri-edit-2-fill)");
        await expect(teamDropLists.first()).toBeVisible({ timeout: 10000 });
        const rightDropList = teamDropLists.last();

        // Inside the target list, locate the clickable team name
        const targetTeamNameLink = rightDropList.locator('span.underline.cursor-pointer').first();

        await expect(targetTeamNameLink).toBeVisible({ timeout: 10000 });

        const teamName = await targetTeamNameLink.textContent();
        console.log(`✅ Found last created team: ${teamName?.trim()}`);

        // Click to open the team management view
        await targetTeamNameLink.scrollIntoViewIfNeeded();
        await targetTeamNameLink.click();
        console.log(`✅ Clicked on team: ${teamName?.trim()}`);

        // Wait for the new view to load fully
        await this.page.waitForLoadState("domcontentloaded");
        await this.page.waitForTimeout(2000);
        console.log("─────────────────────────────────────────────");
    }
}
