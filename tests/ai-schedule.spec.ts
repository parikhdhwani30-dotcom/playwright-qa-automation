import { test } from '@playwright/test';
import { courtRulesFlow } from './flows/AI_Schedule_Generator/court-rules.flow';
import { advancedScenariosFlow } from './flows/AI_Schedule_Generator/advanced-scenarios.flow';
import { timeRulesFlow } from './flows/AI_Schedule_Generator/time-rules.flow';
import { teamRulesFlow } from './flows/AI_Schedule_Generator/team-rules.flow';
import { lanceScenariosFlow } from './flows/AI_Schedule_Generator/lance-scenarios.flow';

import { lanceTimeRestrictionFlow } from './flows/AI_Schedule_Generator/lanceTimeRestriction.flow';

test.describe('@ai-sanity AI Schedule Generation Validation', () => {

    test('Verify time availability rules @ai-time', async ({ page }, testInfo) => {
        test.setTimeout(120000);
        await timeRulesFlow(page, testInfo);
    });

    test('Verify court availability rules @ai-court', async ({ page }, testInfo) => {
        test.setTimeout(120000);
        await courtRulesFlow(page, testInfo);
    });

    test('Verify team specific scenario rules @ai-team', async ({ page }, testInfo) => {
        test.setTimeout(150000);
        await teamRulesFlow(page, testInfo);
    });

    test('Verify advanced schedule scenarios @ai-advanced', async ({ page }, testInfo) => {
        // Advanced rules involve detailed iterations; allow more time.
        test.setTimeout(300000);
        await advancedScenariosFlow(page, testInfo);
    });

    test('Verify Lance specific scenarios @ai-lance', async ({ page }, testInfo) => {
        // Lance scenarios cover diverse rules; allow ample time.
        test.setTimeout(400000);
        await lanceScenariosFlow(page, testInfo);
    });

    test('Verify Lance Time Restriction scenarios @ai-lance-time', async ({ page }, testInfo) => {
        // Time restriction scenarios cover 11 detailed cases.
        test.setTimeout(600000);
        await lanceTimeRestrictionFlow(page, testInfo);
    });

});


//npx playwright test tests/ai-schedule.spec.ts --grep "@ai-team" --reporter=list --debug