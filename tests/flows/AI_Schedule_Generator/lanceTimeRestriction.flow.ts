import { Page, TestInfo, expect } from '@playwright/test';
import { AIScheduleGeneratorPage } from '../../../pages/AI_Schedule_Generator/ai-schedule-generator.page';
import { attachScreenshot } from '../../../utils/allureScreenshot';
import lanceData from '../../data/lanceTimeRestrictions-copy.json';

export async function lanceTimeRestrictionFlow(
    page: Page,
    testInfo: TestInfo,
    tournamentId: string = "379",
    registrationType: string = "team"
) {
    console.log('🚀 Starting Lance AI Time Restriction Scenarios Flow');

    const aiPage = new AIScheduleGeneratorPage(page);

    for (const flow of lanceData.timeRestrictionsFlows) {
        console.log(`\n💬 Running Scenario: ${flow.description} [${flow.id}]`);

        // 1. Visit generator fresh for each scenario to ensure a fresh UI state
        await aiPage.visitGenerator(tournamentId, registrationType);

        // 2. Open AI Generator Panel
        await aiPage.openAIGenerator();

        // Feed the rules
        for (const rule of flow.rules) {
            await aiPage.submitRule(rule);
        }

        await aiPage.waitForGenerationToComplete();

        console.log(`✅ Rules submitted for ${flow.id}. Ready for assertions.`);

        // Wait a small amount of time for the schedule board to update
        await page.waitForTimeout(3000);

        let currentLocationStr = 'default';
        let currentDayStr = 'default';
        let currentAgeGroupStr = 'default';

        // Validate Schedule based on criteria
        for (const assertion of flow.expected) {
            const assertAny = assertion as any;

            if (assertAny.location && assertAny.location !== currentLocationStr && assertAny.location !== 'default') {
                console.log(`🔄 Switching location to ${assertAny.location}...`);
                await aiPage.selectLocation(assertAny.location);
                currentLocationStr = assertAny.location;
                await page.waitForTimeout(2000); // Give time for UI to update
            }

            if (assertAny.day && assertAny.day !== currentDayStr && assertAny.day !== 'default') {
                console.log(`📅 Switching day to ${assertAny.day}...`);
                await aiPage.selectDay(assertAny.day);
                currentDayStr = assertAny.day;
                await page.waitForTimeout(2000); // Give time for UI to update
            }

            if (assertAny.ageGroup && assertAny.ageGroup !== currentAgeGroupStr && assertAny.ageGroup !== 'default') {
                console.log(`👶 Switching Age Group to ${assertAny.ageGroup}...`);
                await aiPage.selectAgeGroup(assertAny.ageGroup);
                currentAgeGroupStr = assertAny.ageGroup;
                await page.waitForTimeout(2000); // Give time for UI to update
            }

            const team = assertAny.team;
            const court = assertAny.court;
            const filter = assertAny.filter;
            const time1 = assertAny.time1;
            const time2 = assertAny.time2;
            const expectedCount = assertAny.count;
            const note = assertAny.note;
            const bufferMinutes = assertAny.bufferMinutes;

            let actualCount = 0;
            const expectedStr = assertAny.operator === 'greaterThan' ? `> ${expectedCount}` : (assertAny.operator === 'notEqual' ? `!= ${expectedCount}` : expectedCount);

            if (['before', 'after', 'between', 'transition_check'].includes(filter)) {
                actualCount = await aiPage.getMatchesCount({
                    teamName: team,
                    courtName: court,
                    timeFilter: filter as any,
                    time1: time1,
                    time2: time2,
                    bufferMinutes: bufferMinutes
                } as any);
                const timeDesc = filter === 'between' ? `${time1} and ${time2}` : (time1 || '');
                console.log(`📍 ${currentLocationStr} - Filter:${filter} ${timeDesc} ${team ? `[Team: ${team}]` : ''}: ${actualCount} (Expected: ${expectedStr}) ${note ? `(${note})` : ''}`);
            } else if (filter === 'amount') {
                actualCount = await aiPage.getMatchesCount({
                    teamName: team,
                    courtName: court
                });
                console.log(`📍 ${currentLocationStr} - Games amount ${team ? `[Team: ${team}]` : ''}: ${actualCount} (Expected: ${expectedStr}) ${note ? `(${note})` : ''}`);
            }
            try {
                if (assertAny.operator === 'greaterThan') {
                    expect.soft(actualCount, `Expected > ${expectedCount} for filter ${filter} ${note ? `(${note})` : ''}, but got ${actualCount}`).toBeGreaterThan(expectedCount as number);
                } else if (assertAny.operator === 'notEqual') {
                    expect.soft(actualCount, `Expected != ${expectedCount} for filter ${filter} ${note ? `(${note})` : ''}, but got ${actualCount}`).not.toBe(expectedCount);
                } else {
                    expect.soft(actualCount, `Expected ${expectedCount} for filter ${filter} ${note ? `(${note})` : ''}, but got ${actualCount}`).toBe(expectedCount);
                }
            } catch (err: unknown) {
                const error = err as Error;
                console.error(`   ❌ Failed Assertion! ${error.message}`);
                await attachScreenshot(page, testInfo, `failure-${flow.id}-${filter}`);
            }
        }
    }
}
