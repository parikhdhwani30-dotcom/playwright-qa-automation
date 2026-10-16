import { Page, TestInfo, expect } from '@playwright/test';
import { AIScheduleGeneratorPage } from '../../../pages/AI_Schedule_Generator/ai-schedule-generator.page';
import { attachScreenshot } from '../../../utils/allureScreenshot';

export async function lanceScenariosFlow(
    page: Page,
    testInfo: TestInfo,
    tournamentId: string = "379",
    registrationType: string = "team"
) {
    console.log('🚀 Starting Lance AI Scenarios Flow');

    const aiPage = new AIScheduleGeneratorPage(page);

    const scenarios = [
        {
            id: 'LANCE_SCENARIO_1_GLOBAL_AND_TEAM_BLACKOUTS',
            description: "Global Morning/Evening Blackouts and Team Curfews (Rules 1, 2, 5, 6, 17, 21)",
            rules: [
                "clear all rules and apply. The facility hours are 7:00 AM to 10:00 PM. No games before 8:00 AM for any team. Panthers Frontier can't play before 10:00 AM. Panthers Tri-State can't play after 6:00 PM. No games after 8:00 PM for any team. Allow 10 minutes buffer between games.",
                "no",
                "yes"
            ],
            assertions: [
                { description: "Global: No games before 8:00 AM", expectedCount: 0, query: { timeFilter: 'before', time1: '8:00 AM' } },
                { description: "Global: No games after 8:00 PM", expectedCount: 0, query: { timeFilter: 'after', time1: '8:00 PM' } },
                { description: "Panthers Frontier: No games before 10:00 AM", expectedCount: 0, query: { teamName: 'Panthers Frontier', timeFilter: 'before', time1: '10:00 AM' } },
                { description: "Panthers Tri-State: No games after 6:00 PM", expectedCount: 0, query: { teamName: 'Panthers Tri-State', timeFilter: 'after', time1: '6:00 PM' } }
            ]
        },
        {
            id: 'LANCE_SCENARIO_2_DATE_SPECIFIC_RESTRICTIONS',
            description: "Late Arrival and Early Departure (Rules 4, 7)",
            rules: [
                "clear all rules and apply. Panthers Vanguard is arriving late, no games before 1:00 PM. Panthers Crossroads is leaving early, last game must end by 2:00 PM.",
                "no",
                "yes"
            ],
            assertions: [
                { description: "Panthers Vanguard: No games before 1:00 PM", expectedCount: 0, query: { teamName: 'Panthers Vanguard', timeFilter: 'before', time1: '1:00 PM' } },
                { description: "Panthers Crossroads: No games after 2:00 PM", expectedCount: 0, query: { teamName: 'Panthers Crossroads', timeFilter: 'after', time1: '2:00 PM' } }
            ]
        },
        {
            id: 'LANCE_SCENARIO_3_MIDDAY_BREAK_AND_EXACT_WINDOW',
            description: "Team Midday Break and Exact Play Window (Rules 9, 13)",
            rules: [
                "clear all rules and apply. Panthers Frontier is blocked from 12:00 PM to 2:00 PM. Panthers Tri-State can only play between 10:00 AM and 4:00 PM.",
                "no",
                "yes"
            ],
            assertions: [
                { description: "Panthers Frontier: No games between 12:00 PM and 2:00 PM", expectedCount: 0, query: { teamName: 'Panthers Frontier', timeFilter: 'between', time1: '12:00 PM', time2: '2:00 PM' } },
                { description: "Panthers Tri-State: No games before 10:00 AM", expectedCount: 0, query: { teamName: 'Panthers Tri-State', timeFilter: 'before', time1: '10:00 AM' } },
                { description: "Panthers Tri-State: No games after 4:00 PM", expectedCount: 0, query: { teamName: 'Panthers Tri-State', timeFilter: 'after', time1: '4:00 PM' } }
            ]
        },
        {
            id: 'LANCE_SCENARIO_4_DURATION_BY_DIVISION',
            description: "Game Duration by Division and Buffer Time (Rules 20, 21)",
            rules: [
                "clear all rules and apply. 10U games are 30 minutes. 12U games are 50 minutes. Allow 10 minutes buffer time between games.",
                "no",
                "yes"
            ],
            assertions: [
                { description: "Check that general matches have 10 minute buffers", expectedCount: 0, query: { timeFilter: 'transition_check', bufferMinutes: 10 } }
            ]
        }
    ];

    for (const scenario of scenarios) {
        console.log(`\n💬 Running Scenario: ${scenario.id} - ${scenario.description}`);

        await aiPage.visitGenerator(tournamentId, registrationType);
        await aiPage.openAIGenerator();

        // Feed the rules
        for (const rule of scenario.rules) {
            await aiPage.submitRule(rule);
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
