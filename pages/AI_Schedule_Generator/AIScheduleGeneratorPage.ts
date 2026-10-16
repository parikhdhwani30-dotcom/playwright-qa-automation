import { Locator, Page } from "@playwright/test";
import { BasePage } from "../baseFile";

export class AIScheduleGeneratorPage extends BasePage {
    readonly autoGenerateBtn: Locator;
    readonly chatInput: Locator;

    constructor(page: Page) {
        super(page);
        this.autoGenerateBtn = page.getByRole('button', { name: /Auto Generate By AI/i });
        this.chatInput = page.getByPlaceholder('Type your message...');
    }

    async visitGenerator(tournamentId: string, registrationType: string) {
        const fullUrl = `/schedule-games?tournamentId=${tournamentId}&registrationType=${registrationType}`;
        await this.page.goto(fullUrl);
        await this.page.waitForLoadState('networkidle');
    }

    async openAIGenerator() {
        await this.autoGenerateBtn.waitFor({ state: 'visible' });
        await this.autoGenerateBtn.click();
        await this.chatInput.waitFor({ state: 'visible' });
    }

    async submitRule(rule: string) {
        await this.chatInput.fill(rule);
        // Submit the rule by pressing Enter
        await this.chatInput.press('Enter');

        // Adding a small delay to simulate processing and prevent sending too fast
        await this.page.waitForTimeout(1000);
    }



    // ⏱️ Extract scheduled times for a specific court
    async getTimesForCourt(courtName: string): Promise<string[]> {
        return await this.page
            .locator(`[data-court="${courtName}"] .time-slot`)
            .allInnerTexts();
    }

    // 🏀 Count matches on a court
    async getMatchCountForCourt(courtName: string): Promise<number> {
        // 1. Find the column index of the court by looking at the table headers
        const colIndex = await this.page.evaluate((name) => {
            const thElements = Array.from(document.querySelectorAll('table thead th'));
            const index = thElements.findIndex(th => {
                const span = th.querySelector('span[title]');
                return span && span.textContent?.trim() === name.trim();
            });
            // Return 1-based index (css nth-child is 1-based)
            return index !== -1 ? index + 1 : -1;
        }, courtName);

        if (colIndex === -1) {
            console.log(`⚠️ Court "${courtName}" not found on the current view.`);
            return 0;
        }

        // 2. Count .cdk-drag (matches) inside that specific column in the tbody
        return await this.page
            .locator(`table tbody tr td:nth-child(${colIndex}) .cdk-drag`)
            .count()
            .catch(() => 0);
    }

    // 🏀 Count matches for a specific TEAM on a specific court
    async getTeamMatchCountForCourt(courtName: string, teamName: string): Promise<number> {
        // 1. Find the column index of the court
        const colIndex = await this.page.evaluate((name) => {
            const thElements = Array.from(document.querySelectorAll('table thead th'));
            const index = thElements.findIndex(th => {
                const span = th.querySelector('span[title]');
                return span && span.textContent?.trim() === name.trim();
            });
            return index !== -1 ? index + 1 : -1;
        }, courtName);

        if (colIndex === -1) {
            console.log(`⚠️ Court "${courtName}" not found on the current view.`);
            return 0;
        }

        // 2. Count .cdk-drag elements that belong to that column AND contain the specific teamName
        return await this.page
            .locator(`table tbody tr td:nth-child(${colIndex}) .cdk-drag`)
            .filter({ hasText: teamName }) // ✨ Filter by specific team name inside the match card
            .count()
            .catch(() => 0);
    }

    // ⏰ Count matches on a court with time restrictions
    async getMatchCountForCourtWithTimeFilter(
        courtName: string,
        filterType: 'before' | 'after' | 'between',
        time1Str: string,
        time2Str?: string
    ): Promise<number> {
        return await this.page.evaluate(({ court, filter, t1, t2 }) => {
            function parseTime(timeStr: string) {
                if (!timeStr) return 0;
                const parts = timeStr.trim().split(' ');
                if (parts.length < 2) return 0;
                const time = parts[0];
                const modifier = parts[1];
                let [hours, minutes] = time.split(':');
                if (hours === '12') {
                    hours = '00';
                }
                let hrs = parseInt(hours, 10);
                if (modifier?.toUpperCase() === 'PM' || modifier?.toUpperCase() === 'PM') {
                    hrs += 12;
                }
                const d = new Date();
                d.setHours(hrs, parseInt(minutes, 10), 0, 0);
                return d.getTime();
            }

            const targetTime1 = parseTime(t1);
            const targetTime2 = t2 ? parseTime(t2) : 0;

            const thElements = Array.from(document.querySelectorAll('table thead th'));
            const colIndex = thElements.findIndex(th => {
                const span = th.querySelector('span[title]');
                return span && span.textContent?.trim() === court.trim();
            });

            if (colIndex === -1) return 0;

            // the index to use for td is colIndex + 1 (nth-child is 1-based)
            const tdIndex = colIndex + 1;

            let totalMatches = 0;
            const rows = document.querySelectorAll('table tbody tr');
            rows.forEach(row => {
                const timeTd = row.querySelector('td:nth-child(1)');
                if (!timeTd) return;

                const rowTimeStr = timeTd.textContent?.trim();
                if (!rowTimeStr) return;

                const rowTime = parseTime(rowTimeStr);
                if (rowTime === 0) return;

                let timeMatches = false;
                if (filter === 'before' && rowTime < targetTime1) timeMatches = true;
                if (filter === 'after' && rowTime > targetTime1) timeMatches = true;
                if (filter === 'between' && rowTime >= targetTime1 && rowTime < targetTime2) timeMatches = true;

                if (timeMatches) {
                    const courtTd = row.querySelector(`td:nth-child(${tdIndex})`);
                    if (courtTd) {
                        const matches = courtTd.querySelectorAll('.cdk-drag');
                        totalMatches += matches.length;
                    }
                }
            });
            return totalMatches;
        }, { court: courtName, filter: filterType, t1: time1Str, t2: time2Str });
    }

    // 📍 Helper to change location to view other courts (e.g. "new Locwsdsd")
    async selectLocation(locationName: string) {
        // NOTE: Update the locator below to match your actual location dropdown click
        await this.page.locator('ng-select').filter({ hasText: 'Location' }).click();

        // Select the option from the ng-dropdown-panel
        await this.page.locator(`ng-dropdown-panel .ng-option:has-text("${locationName}")`).click();
        await this.page.waitForTimeout(1000); // Wait for board to reload
    }

    // 🏆 Advanced rule verification
    async getMatchesCount(options: {
        teamName?: string;
        teams?: string[]; // for simultaneous check
        match?: string; // for specific match string logic
        courtName?: string;
        timeFilter?: 'before' | 'after' | 'between' | 'simultaneous_check' | 'first_slot' | 'last_slot' | 'back_to_back';
        time1?: string;
        time2?: string;
    }): Promise<number> {
        return await this.page.evaluate((opts) => {
            // ----- NEW ADVANCED FILTERS -----

            if (opts.timeFilter === 'simultaneous_check' && opts.teams) {
                let simultaneousCount = 0;
                const rows = document.querySelectorAll('table tbody tr');
                rows.forEach(row => {
                    let foundAll = true;
                    for (const team of opts.teams!) { // Using non-null assertion since checked above
                        let teamFoundInRow = false;
                        const matches = Array.from(row.querySelectorAll('.cdk-drag'));
                        for (const match of matches) {
                            if (match.textContent?.toLowerCase().includes(team.toLowerCase())) {
                                teamFoundInRow = true;
                                break;
                            }
                        }
                        if (!teamFoundInRow) {
                            foundAll = false;
                            break;
                        }
                    }
                    if (foundAll) simultaneousCount++;
                });
                return simultaneousCount;
            }

            if (opts.timeFilter === 'first_slot') {
                const rows = document.querySelectorAll('table tbody tr');
                if (rows.length === 0) return 0;
                const firstRow = rows[0];
                const target = opts.match || opts.teamName || '';
                if (!target) return 0;
                const matches = Array.from(firstRow.querySelectorAll('.cdk-drag'));
                for (const match of matches) {
                    if (match.textContent?.toLowerCase().includes(target.toLowerCase())) {
                        return 1;
                    }
                }
                return 0;
            }

            if (opts.timeFilter === 'last_slot') {
                const rows = document.querySelectorAll('table tbody tr');
                if (rows.length === 0) return 0;
                const lastRow = rows[rows.length - 1];
                const target = opts.match || opts.teamName || '';
                if (!target) return 0;
                let found = 0;
                const matches = Array.from(lastRow.querySelectorAll('.cdk-drag'));
                for (const match of matches) {
                    if (match.textContent?.toLowerCase().includes(target.toLowerCase())) {
                        found++;
                    }
                }
                return found;
            }

            if (opts.timeFilter === 'back_to_back') {
                if (!opts.teamName) return 0;
                let backToBackCount = 0;
                let previousRowHadTeam = false;
                const rows = document.querySelectorAll('table tbody tr');
                rows.forEach(row => {
                    let teamInCurrentRow = false;
                    const matches = Array.from(row.querySelectorAll('.cdk-drag'));
                    for (const match of matches) {
                        if (match.textContent?.toLowerCase().includes(opts.teamName!.toLowerCase())) {
                            teamInCurrentRow = true;
                            break;
                        }
                    }
                    if (teamInCurrentRow && previousRowHadTeam) {
                        backToBackCount++;
                    }
                    previousRowHadTeam = teamInCurrentRow;
                });
                return backToBackCount;
            }

            // ----- ORIGINAL FILTERS (Before/After/Between/Amount) -----

            function parseTime(timeStr: string) {
                if (!timeStr) return 0;
                const parts = timeStr.trim().split(' ');
                if (parts.length < 2) return 0;
                const time = parts[0];
                const modifier = parts[1];
                let [hours, minutes] = time.split(':');
                if (hours === '12') {
                    hours = '00';
                }
                let hrs = parseInt(hours, 10);
                if (modifier?.toUpperCase() === 'PM' || modifier?.toUpperCase() === 'PM') {
                    hrs += 12;
                }
                const d = new Date();
                d.setHours(hrs, parseInt(minutes, 10), 0, 0);
                return d.getTime();
            }

            const targetTime1 = opts.time1 ? parseTime(opts.time1) : 0;
            const targetTime2 = opts.time2 ? parseTime(opts.time2) : 0;

            let colIndices: number[] = [];
            const thElements = Array.from(document.querySelectorAll('table thead th'));

            if (opts.courtName) {
                const index = thElements.findIndex(th => {
                    const span = th.querySelector('span[title]');
                    return span && span.textContent?.trim() === opts.courtName?.trim();
                });
                if (index !== -1) colIndices.push(index + 1);
            } else {
                // All courts (Skip the first column, which is "Time")
                for (let i = 1; i < thElements.length; i++) {
                    colIndices.push(i + 1);
                }
            }

            if (colIndices.length === 0) return 0;

            let totalMatches = 0;
            const rows = document.querySelectorAll('table tbody tr');
            rows.forEach(row => {
                const timeTd = row.querySelector('td:nth-child(1)');
                if (!timeTd) return;

                const rowTimeStr = timeTd.textContent?.trim();
                if (!rowTimeStr) return;

                const rowTime = parseTime(rowTimeStr);
                if (rowTime === 0) return;

                let timeMatches = true;
                if (opts.timeFilter === 'before' && rowTime >= targetTime1) timeMatches = false;
                if (opts.timeFilter === 'after' && rowTime <= targetTime1) timeMatches = false;
                if (opts.timeFilter === 'between' && (rowTime < targetTime1 || rowTime >= targetTime2)) timeMatches = false;

                if (timeMatches) {
                    colIndices.forEach(tdIndex => {
                        const courtTd = row.querySelector(`td:nth-child(${tdIndex})`);
                        if (courtTd) {
                            const matchElements = Array.from(courtTd.querySelectorAll('.cdk-drag'));
                            matchElements.forEach(match => {
                                if (opts.teamName) {
                                    if (match.textContent?.toLowerCase().includes(opts.teamName.toLowerCase())) {
                                        totalMatches++;
                                    }
                                } else {
                                    totalMatches++;
                                }
                            });
                        }
                    });
                }
            });
            return totalMatches;
        }, options);
    }
}
