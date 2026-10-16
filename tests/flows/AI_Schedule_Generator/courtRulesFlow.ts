import { Page, TestInfo, expect } from '@playwright/test';
import { AIScheduleGeneratorPage } from '../../../pages/AI_Schedule_Generator/AIScheduleGeneratorPage';
import courtData from '../../data/courtRules.json';

export async function courtRulesFlow(
    page: Page,
    testInfo: TestInfo,
    tournamentId: string = "379",
    registrationType: string = "team",
    // feesId: string = "1270"
) {
    console.log('🚀 Starting AI Court Rules Flow (5 Buckets)');

    const aiPage = new AIScheduleGeneratorPage(page);

    // Loop over the 5 optimized court flows
    for (const flow of courtData.courtFlows) {
        console.log(`\n💬 Running Scenario: ${flow.description} [${flow.id}]`);

        // await aiPage.visitGenerator(tournamentId, registrationType, feesId);
        await aiPage.visitGenerator(tournamentId, registrationType);
        await aiPage.openAIGenerator();

        for (const rule of flow.rules) {
            await aiPage.submitRule(rule);
        }



        console.log(`✅ Rules submitted for ${flow.id}. Ready for assertions.`);

        // Iterate dynamically through expected assertions from JSON
        let currentLocationStr = 'default';

        for (const assertion of (flow as any).expected) {
            // Switch location if needed
            if (assertion.location && assertion.location !== currentLocationStr && assertion.location !== 'default') {
                console.log(`🔄 Switching location to ${assertion.location}...`);
                await aiPage.selectLocation(assertion.location);
                currentLocationStr = assertion.location;
            } else if (assertion.location === 'default' && currentLocationStr !== 'default') {
                // If it needs default location but we are at another, go back to top-level All Location, etc.
                // Assuming "All Locations" would be handled or we reset?
                // Depending on the app this might be selectLocation('All Locations')
                // But generally tests are written so 'default' rules run first before traversing deep locations.
            }

            // Extract assertion values
            const court = assertion.court;
            const filter = assertion.filter;
            const time1 = assertion.time1;
            const time2 = assertion.time2;
            const expectedCount = assertion.count;

            let actualCount = 0;

            if (filter === 'amount') {
                actualCount = await aiPage.getMatchesCount({ courtName: court });
                console.log(`📍 ${currentLocationStr} - ${court} Games Found: ${actualCount} (Expected: ${expectedCount})`);
            } else if (filter === 'before' || filter === 'after' || filter === 'between') {
                actualCount = await aiPage.getMatchesCount({
                    courtName: court,
                    timeFilter: filter as 'before' | 'after' | 'between',
                    time1: time1,
                    time2: time2
                });
                const timeDesc = filter === 'between' ? `${time1} and ${time2}` : time1;
                console.log(`📍 ${currentLocationStr} - ${court} Games ${filter} ${timeDesc}: ${actualCount} (Expected: ${expectedCount})`);
            }

            try {
                expect(actualCount).toBe(expectedCount);
            } catch (error) {
                console.error(`   ❌ Failed! Expected ${expectedCount} but got ${actualCount} for ${court} ${filter}.`);
                throw error;
            }
        }
    }
}
