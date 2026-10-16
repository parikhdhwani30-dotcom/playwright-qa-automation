import { expect, Page, TestInfo } from '@playwright/test';
import { AIScheduleGeneratorPage } from '../../../pages/AI_Schedule_Generator/ai-schedule-generator.page';
import timeData from '../../data/timeRules.json';
import { attachScreenshot } from '../../../utils/allureScreenshot';

export async function timeRulesFlow(
    page: Page,
    testInfo: TestInfo,
    tournamentId: string = "379",
    registrationType: string = "team",
) {
    console.log('🚀 Starting AI Time Rules Flow');

    const aiPage = new AIScheduleGeneratorPage(page);

    for (const flow of timeData.timeFlows) {
        console.log(`\n💬 Running Scenario: ${flow.description} [${flow.id}]`);

        // 1. Visit generator fresh for each scenario to ensure a fresh UI state
        await aiPage.visitGenerator(tournamentId, registrationType);

        // 2. Open AI Generator Panel
        await aiPage.openAIGenerator();

        for (const rule of flow.rules) {
            await aiPage.submitRule(rule);
        }

        await aiPage.waitForGenerationToComplete();

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
            } else if (assertion.location === 'default' && currentLocationStr !== 'default') {
                // If we need to go back to default but we're on a specific location (if applicable)
                // In your app, 'default' might refer to the first location or need page reload, but let's assume switching isn't needed or we reload
            }

            const filter = assertion.filter;
            const time1 = assertion.time1;
            const time2 = assertion.time2;
            const expectedCount = assertion.count;

            let actualCount = 0;

            if (filter === 'before' || filter === 'after' || filter === 'between') {
                actualCount = await aiPage.getMatchesCount({
                    timeFilter: filter as 'before' | 'after' | 'between',
                    time1: time1,
                    time2: time2
                });
                const timeDesc = filter === 'between' ? `${time1} and ${time2}` : time1;
                console.log(`📍 ${currentLocationStr} - Games ${filter} ${timeDesc}: ${actualCount} (Expected: ${expectedCount})`);
            } else if (filter === 'amount') {
                actualCount = await aiPage.getMatchesCount({});
                console.log(`📍 ${currentLocationStr} - All Games amount: ${actualCount} (Expected: ${expectedCount})`);
            }

            try {
                expect.soft(actualCount, `Expected ${expectedCount} matches for filter ${filter} ${time1 || ''} at ${currentLocationStr}, but got ${actualCount}`).toBe(expectedCount);
            } catch (err: unknown) {
                const error = err as Error;
                console.error(`   ❌ Failed Assertion! ${error.message}`);
                // Taking a screenshot for debugging
                await attachScreenshot(page, testInfo, `failure-${flow.id}-${filter}`);
            }
        }
    }
}
