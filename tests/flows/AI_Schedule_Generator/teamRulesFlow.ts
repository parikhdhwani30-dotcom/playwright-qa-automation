import { expect, Page, TestInfo } from '@playwright/test';
import { AIScheduleGeneratorPage } from '../../../pages/AI_Schedule_Generator/AIScheduleGeneratorPage';
import teamData from '../../data/teamRules.json';

export async function teamRulesFlow(
    page: Page,
    testInfo: TestInfo,
    tournamentId: string = "379",
    registrationType: string = "team",
) {
    console.log('🚀 Starting AI Team Rules Flow');

    const aiPage = new AIScheduleGeneratorPage(page);

    for (const flow of teamData.teamFlows) {
        console.log(`\n💬 Running Scenario: ${flow.description} [${flow.id}]`);

        // 1. Visit generator fresh for each scenario to ensure a fresh UI state
        await aiPage.visitGenerator(tournamentId, registrationType);

        // 2. Open AI Generator Panel
        await aiPage.openAIGenerator();

        // 3. Submit all rules from the JSON for this scenario
        for (const rule of flow.rules) {
            await aiPage.submitRule(rule);
        }

        console.log(`✅ Rules submitted for ${flow.id}. Ready for assertions.`);

        // Wait a small amount of time for the schedule board to update
        await page.waitForTimeout(3000);

        let currentLocationStr = 'default';

        // 4. Assertions
        for (const assertion of flow.expected) {
            if (assertion.location && assertion.location !== currentLocationStr && assertion.location !== 'default') {
                console.log(`🔄 Switching location to ${assertion.location}...`);
                await aiPage.selectLocation(assertion.location);
                currentLocationStr = assertion.location;
                await page.waitForTimeout(2000); // Give time for UI to update
            }

            const team = (assertion as any).team;
            const teams = (assertion as any).teams;
            const match = (assertion as any).match;
            const court = (assertion as any).court;
            const filter = (assertion as any).filter;
            const time1 = (assertion as any).time1;
            const time2 = (assertion as any).time2;
            const expectedCount = (assertion as any).count;
            const note = (assertion as any).note;

            let actualCount = 0;

            if (filter === 'before' || filter === 'after' || filter === 'between' ||
                filter === 'simultaneous_check' || filter === 'first_slot' || filter === 'last_slot' || filter === 'back_to_back') {
                actualCount = await aiPage.getMatchesCount({
                    teamName: team,
                    teams: teams,
                    match: match,
                    courtName: court,
                    timeFilter: filter as 'before' | 'after' | 'between' | 'simultaneous_check' | 'first_slot' | 'last_slot' | 'back_to_back',
                    time1: time1,
                    time2: time2
                });
                const timeDesc = filter === 'between' ? `${time1} and ${time2}` : (time1 || '');
                console.log(`📍 ${currentLocationStr} - Filter:${filter} ${timeDesc} ${team ? `[Team: ${team}]` : ''} ${match ? `[Match: ${match}]` : ''} ${court ? `[Court: ${court}]` : ''}: ${actualCount} (Expected: ${expectedCount}) ${note ? `(${note})` : ''}`);
            } else if (filter === 'amount') {
                actualCount = await aiPage.getMatchesCount({
                    teamName: team,
                    courtName: court
                });
                console.log(`📍 ${currentLocationStr} - Games amount ${team ? `[Team: ${team}]` : ''} ${court ? `[Court: ${court}]` : ''}: ${actualCount} (Expected: ${expectedCount}) ${note ? `(${note})` : ''}`);
            }

            try {
                expect(actualCount, `Expected ${expectedCount} matches for filter ${filter} ${time1 || ''} at ${currentLocationStr}, but got ${actualCount}`).toBe(expectedCount);
            } catch (err: unknown) {
                const error = err as Error;
                console.error(`   ❌ Failed Assertion! ${error.message}`);
                // Taking a screenshot for debugging
                await page.screenshot({ path: `failure-${flow.id}-${filter}-${Date.now()}.png` });
                throw error;
            }
        }
    }
}
