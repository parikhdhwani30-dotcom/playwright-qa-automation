import { Page, TestInfo, expect } from '@playwright/test';
import { AIScheduleGeneratorPage } from '../../../pages/AI_Schedule_Generator/ai-schedule-generator.page';
import { attachScreenshot } from '../../../utils/allureScreenshot';

export async function advancedScenariosFlow(
    page: Page,
    testInfo: TestInfo,
    tournamentId: string = "379",
    registrationType: string = "team"
) {
    console.log('🚀 Starting Advanced AI Scenarios Flow');

    const aiPage = new AIScheduleGeneratorPage(page);

    // Hardcoding scenarios as requested by the user, skipping the JSON configuration
    const scenarios = [
        {
            id: 'SCENARIO_1_LATE_ARRIVAL_EARLY_DEPARTURE',
            description: "Late Arrival for Frontier, Early Departure for Vanguard",
            rules: [
                "clear all rules and apply. Panthers Frontier arriving late, no games before 1:00 PM. Panthers Vanguard leaving early, last game must end by 2:00 PM.",
                "no",
                "yes"
            ],
            assertions: [
                { description: "Panthers Frontier cannot play before 1:00 PM", expectedCount: 0, query: { teamName: 'Panthers Frontier', timeFilter: 'before', time1: '1:00 PM' } },
                { description: "Panthers Vanguard cannot play after 2:00 PM", expectedCount: 0, query: { teamName: 'Panthers Vanguard', timeFilter: 'after', time1: '2:00 PM' } }
            ]
        },
        {
            id: 'SCENARIO_2_EXACT_WINDOW_EVENING_CURFEW',
            description: "Exact Window for Tri-State, Evening Curfew for Crossroads",
            rules: [
                "clear all rules and apply. Panthers Tri-State can only play between 10:00 AM and 4:00 PM. Panthers Crossroads cannot play after 6:00 PM.",
                "no",
                "yes"
            ],
            assertions: [
                { description: "Panthers Tri-State cannot play before 10:00 AM", expectedCount: 0, query: { teamName: 'Panthers Tri-State', timeFilter: 'before', time1: '10:00 AM' } },
                { description: "Panthers Tri-State cannot play after 4:00 PM", expectedCount: 0, query: { teamName: 'Panthers Tri-State', timeFilter: 'after', time1: '4:00 PM' } },
                { description: "Panthers Crossroads cannot play after 6:00 PM", expectedCount: 0, query: { teamName: 'Panthers Crossroads', timeFilter: 'after', time1: '6:00 PM' } }
            ]
        },
        {
            id: 'SCENARIO_3_FACILITY_HOURS_MIDDAY_BREAK',
            description: "Facility operating hours combined with Midday Break",
            rules: [
                "clear all rules and apply. Courts available 9:00 AM to 7:00 PM. Panthers Frontier blocked from 12:00 PM to 2:00 PM. Allow 15-minute buffer between games.",
                "no",
                "yes"
            ],
            assertions: [
                { description: "No games before 9:00 AM globally", expectedCount: 0, query: { timeFilter: 'before', time1: '9:00 AM' } },
                { description: "No games after 7:00 PM globally", expectedCount: 0, query: { timeFilter: 'after', time1: '7:00 PM' } },
                { description: "Panthers Frontier cannot play between 12:00 PM and 2:00 PM", expectedCount: 0, query: { teamName: 'Panthers Frontier', timeFilter: 'between', time1: '12:00 PM', time2: '2:00 PM' } }
            ]
        },
        {
            id: 'SCENARIO_4_BREAK_BETWEEN_GAMES',
            description: "A game can be scheduled after a 3-hour break for Panthers Crossroads",
            rules: [
                "clear all rules and apply. Panthers Crossroads must have at least a 3-hour break between games.",
                "no",
                "yes"
            ],
            assertions: [
                { description: "Check that Panthers Crossroads games are separated by at least 3 hours", expectedCount: 0, query: { teamName: 'Panthers Crossroads', timeFilter: 'gap_check', gapMinutes: 180 } }
            ]
        },
        {
            id: 'SCENARIO_5_GAME_DURATION_AND_TRANSITION',
            description: "10U games are 30 minutes, 14U games are 50 minutes. Age group match can be scheduled after 30 mins buffer.",
            rules: [
                "clear all rules and apply. 10U games are 30 minutes. 14U games are 50 minutes. Any match must be scheduled after a 30-minute buffer time.",
                "no",
                "yes"
            ],
            assertions: [
                // In Playwright tests, testing duration of slots visually vs gaps may be complex, 
                // but setting up the query parameters to act as a placeholder for duration/gap check.
                { description: "Check that general matches have 30 minute buffers", expectedCount: 0, query: { timeFilter: 'transition_check', bufferMinutes: 30 } }
            ]
        }
    ];

    for (const scenario of scenarios) {
        console.log(`\n💬 Running Scenario: ${scenario.id} ${scenario.description ? '- ' + scenario.description : ''}`);

        await aiPage.visitGenerator(tournamentId, registrationType);
        await aiPage.openAIGenerator();

        // Feed the rules
        for (const rule of scenario.rules) {
            await aiPage.submitRule(rule);
            // wait time is maintained inside submitRule, though we could add explicit wait here if the chat replies
        }

        await aiPage.waitForGenerationToComplete();

        console.log(`✅ Rules submitted for ${scenario.id}. Starting assertions.`);

        // Wait a small amount of time for the schedule board to update
        await page.waitForTimeout(3000);

        // Validate Schedule based on criteria
        for (const assertion of scenario.assertions) {
            const resultCount = await aiPage.getMatchesCount(assertion.query as any);
            console.log(`🔎 Verifying: ${assertion.description}`);
            
            if (resultCount === assertion.expectedCount) {
                console.log(`   ✔️ Success! Count is ${resultCount}`);
            } else {
                console.error(`   ❌ Failed! Expected ${assertion.expectedCount} but got ${resultCount} for ${assertion.description}.`);
                await attachScreenshot(page, testInfo, `failure-${scenario.id}`);
            }

            // Still use expect.soft to mark the test as failed in Playwright
            expect.soft(resultCount, `Expected ${assertion.expectedCount} but got ${resultCount} for ${assertion.description}`).toBe(assertion.expectedCount);
        }
    }
}
