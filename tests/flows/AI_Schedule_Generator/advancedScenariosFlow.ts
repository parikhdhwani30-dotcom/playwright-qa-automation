import { Page, TestInfo, expect } from '@playwright/test';
import { AIScheduleGeneratorPage } from '../../../pages/AI_Schedule_Generator/AIScheduleGeneratorPage';

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
            id: 'SCENARIO_1',
            rules: [
                "No games start before 10:00 AM, Panthers Tri-State after 10:00 AM, Panthers Crossroads blocked 12:00-2:00 PM, finish by 8:00 PM.",
                "yes"
            ],
            assertions: [
                { description: "No games before 10:00 AM", expectedCount: 0, query: { timeFilter: 'before', time1: '10:00 AM' } },
                { description: "Panthers Tri-State cannot play before 10:00 AM", expectedCount: 0, query: { teamName: 'Panthers Tri-Stater', timeFilter: 'before', time1: '10:00 AM' } },
                { description: "Panthers Crossroads cannot play between 12:00 PM and 2:00 PM", expectedCount: 0, query: { teamName: 'Panthers Crossroads', timeFilter: 'between', time1: '12:00 PM', time2: '2:00 PM' } },
                { description: "No games at/after 8:00 PM (finish before 8:00 PM)", expectedCount: 0, query: { timeFilter: 'after', time1: '8:00 PM' } }
            ]
        },
        {
            id: 'SCENARIO_2',
            rules: [
                "Facility 7:00 AM-10:00 PM, Panthers Tri-State after 1:00 PM (March 7), 8U games 30m with 10m buffer.",
                "yes"
            ],
            assertions: [
                { description: "No games before 7:00 AM", expectedCount: 0, query: { timeFilter: 'before', time1: '7:00 AM' } },
                { description: "No games after 10:00 PM", expectedCount: 0, query: { timeFilter: 'after', time1: '10:00 PM' } },
                { description: "Panthers Tri-State cannot play before 1:00 PM", expectedCount: 0, query: { teamName: 'Panthers Tri-State', timeFilter: 'before', time1: '1:00 PM' } }
            ]
        },
        {
            id: 'SCENARIO_3',
            rules: [
                "No team before 9:00 AM, Panthers Vanguard only 10:00 AM-4:00 PM, 14U games 50m with 15m transition.",
                "yes"
            ],
            assertions: [
                { description: "No team should play before 9:00 AM", expectedCount: 0, query: { timeFilter: 'before', time1: '9:00 AM' } },
                { description: "Panthers Vanguard cannot play before 10:00 AM", expectedCount: 0, query: { teamName: 'Panthers Vanguard', timeFilter: 'before', time1: '10:00 AM' } },
                { description: "Panthers Vanguard cannot play after 4:00 PM", expectedCount: 0, query: { teamName: 'Panthers Vanguard', timeFilter: 'after', time1: '4:00 PM' } }
            ]
        },
        {
            id: 'SCENARIO_4',
            rules: [
                "Open 8:00 AM, Panthers Vanguard no play after 6:00 PM, Crossroads blocked 12:00-2:00 PM, 12U games 40m + 10m buffer.",
                "yes"
            ],
            assertions: [
                { description: "No games before 8:00 AM", expectedCount: 0, query: { timeFilter: 'before', time1: '8:00 AM' } },
                { description: "Panthers Vanguard cannot play after 6:00 PM", expectedCount: 0, query: { teamName: 'Panthers Vanguard', timeFilter: 'after', time1: '6:00 PM' } },
                { description: "Panthers Crossroads cannot play between 12:00 PM and 2:00 PM", expectedCount: 0, query: { teamName: 'Panthers Crossroads', timeFilter: 'between', time1: '12:00 PM', time2: '2:00 PM' } }
            ]
        },
        {
            id: 'SCENARIO_5',
            rules: [
                "No games before 8:30 AM, Panthers Tri-Stater finish before 2:00 PM (March 8), 20m transition time.",
                "yes"
            ],
            assertions: [
                { description: "No games before 8:30 AM", expectedCount: 0, query: { timeFilter: 'before', time1: '8:30 AM' } },
                { description: "Panthers Tri-Stater cannot play at/after 2:00 PM", expectedCount: 0, query: { teamName: 'Panthers Tri-Stater', timeFilter: 'after', time1: '2:00 PM' } } // Assuming after includes exactly 2:00 PM or they just don't play.
            ]
        },
        {
            id: 'SCENARIO_6',
            rules: [
                "7:30 AM-8:30 PM, Panthers Vanguard after 12:00 PM, Crossroads blocked 1:00-3:00 PM, 8U games 30m.",
                "yes"
            ],
            assertions: [
                { description: "No games before 7:30 AM", expectedCount: 0, query: { timeFilter: 'before', time1: '7:30 AM' } },
                { description: "No games after 8:30 PM", expectedCount: 0, query: { timeFilter: 'after', time1: '8:30 PM' } },
                { description: "Panthers Vanguard cannot play before 12:00 PM", expectedCount: 0, query: { teamName: 'Panthers Vanguard', timeFilter: 'before', time1: '12:00 PM' } },
                { description: "Panthers Crossroads cannot play between 1:00 PM and 3:00 PM", expectedCount: 0, query: { teamName: 'Panthers Crossroads', timeFilter: 'between', time1: '1:00 PM', time2: '3:00 PM' } }
            ]
        },
        {
            id: 'SCENARIO_7',
            rules: [
                "No games before 8:00 AM, Tri-State after 1:00 PM (March 7), Vanguard finish by 6:00 PM, 10m buffer.",
                "yes"
            ],
            assertions: [
                { description: "No games before 8:00 AM", expectedCount: 0, query: { timeFilter: 'before', time1: '8:00 AM' } },
                { description: "Panthers Tri-State cannot play before 1:00 PM", expectedCount: 0, query: { teamName: 'Panthers Tri-State', timeFilter: 'before', time1: '1:00 PM' } },
                { description: "Panthers Vanguard cannot play after 6:00 PM", expectedCount: 0, query: { teamName: 'Panthers Vanguard', timeFilter: 'after', time1: '6:00 PM' } }
            ]
        },
        {
            id: 'SCENARIO_8',
            rules: [
                "7:00 AM-10:00 PM, Vanguard 10:00 AM-4:00 PM, Frontier finish by 2:00 PM (March 8), 14U 50m games.",
                "yes"
            ],
            assertions: [
                { description: "No games before 7:00 AM", expectedCount: 0, query: { timeFilter: 'before', time1: '7:00 AM' } },
                { description: "No games after 10:00 PM", expectedCount: 0, query: { timeFilter: 'after', time1: '10:00 PM' } },
                { description: "Panthers Vanguard cannot play before 10:00 AM", expectedCount: 0, query: { teamName: 'Panthers Vanguard', timeFilter: 'before', time1: '10:00 AM' } },
                { description: "Panthers Vanguard cannot play after 4:00 PM", expectedCount: 0, query: { teamName: 'Panthers Vanguard', timeFilter: 'after', time1: '4:00 PM' } },
                { description: "Panthers Tri-Stater cannot play after 2:00 PM", expectedCount: 0, query: { teamName: 'Panthers Tri-Stater', timeFilter: 'after', time1: '2:00 PM' } }
            ]
        },
        {
            id: 'SCENARIO_9',
            rules: [
                "No games before 8:00 AM, Crossroads blocked 12:00-2:00 PM, Vanguard finish by 6:00 PM, 15m transition.",
                "yes"
            ],
            assertions: [
                { description: "No games before 8:00 AM", expectedCount: 0, query: { timeFilter: 'before', time1: '8:00 AM' } },
                { description: "Panthers Crossroads cannot play between 12:00 PM and 2:00 PM", expectedCount: 0, query: { teamName: 'Panthers Crossroads', timeFilter: 'between', time1: '12:00 PM', time2: '2:00 PM' } },
                { description: "Panthers Vanguard cannot play after 6:00 PM", expectedCount: 0, query: { teamName: 'Panthers Vanguard', timeFilter: 'after', time1: '6:00 PM' } }
            ]
        },
        {
            id: 'SCENARIO_10',
            description: "Full AI Stress Test",
            rules: [
                "Full Stress Test: 7AM-10PM, Vanguard 12PM-4PM, Crossroads blocked 12-2PM, Tri-State 1PM (Mar 7), Frontier 2PM (Mar 8), 8U 30m, 10m buffer.",
                "yes"
            ],
            assertions: [
                { description: "No games before 8:00 AM", expectedCount: 0, query: { timeFilter: 'before', time1: '8:00 AM' } },
                { description: "No games after 10:00 PM", expectedCount: 0, query: { timeFilter: 'after', time1: '10:00 PM' } },
                { description: "Panthers Vanguard cannot play before 12:00 PM", expectedCount: 0, query: { teamName: 'Panthers Vanguard', timeFilter: 'before', time1: '12:00 PM' } },
                { description: "Panthers Crossroads cannot play between 12:00 PM and 2:00 PM", expectedCount: 0, query: { teamName: 'Panthers Crossroads', timeFilter: 'between', time1: '12:00 PM', time2: '2:00 PM' } },
                { description: "Panthers Tri-State cannot play before 1:00 PM", expectedCount: 0, query: { teamName: 'Panthers Tri-State', timeFilter: 'before', time1: '1:00 PM' } },
                { description: "Panthers Vanguard cannot play after 4:00 PM (stricter rule)", expectedCount: 0, query: { teamName: 'Panthers Vanguard', timeFilter: 'after', time1: '4:00 PM' } },
                { description: "Panthers Tri-Stater cannot play at/after 2:00 PM", expectedCount: 0, query: { teamName: 'Panthers Tri-Stater', timeFilter: 'after', time1: '2:00 PM' } }
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

        console.log(`✅ Rules submitted for ${scenario.id}. Starting assertions.`);

        // Wait a small amount of time for the schedule board to update
        await page.waitForTimeout(3000);

        // Validate Schedule based on criteria
        for (const assertion of scenario.assertions) {
            const resultCount = await aiPage.getMatchesCount(assertion.query as any);
            console.log(`🔎 Verifying: ${assertion.description}`);
            try {
                expect(resultCount).toBe(assertion.expectedCount);
                console.log(`   ✔️ Success! Count is ${resultCount}`);
            } catch (error) {
                console.error(`   ❌ Failed! Expected ${assertion.expectedCount} but got ${resultCount} for ${assertion.description}.`);
                throw error;
            }
        }
    }
}
