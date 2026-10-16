// tests/sanity.spec.ts
import { Page, test, TestInfo } from '@playwright/test';
//General & Communication
import { manageUserFlow } from './flows/AdminCenter/General-Communication/manage-userFlow';
import { purchaseHistoryFlow } from './flows/AdminCenter/General-Communication/purchase-historyFlow.ts';
import { pushNotificationFlow } from './flows/AdminCenter/General-Communication/push-notificationFlow.ts';
import { sendEmailFlow } from './flows/AdminCenter/General-Communication/send-emailFlow';
import { sendSmsFlow } from './flows/AdminCenter/General-Communication/send-smsFlow.ts';

//Train & Compete
import { manageChildCommunitiesFlow } from './flows/AdminCenter/Train-Compete/manage-child-communitiesFlow';
import { manageCustomFormFlow } from './flows/AdminCenter/Train-Compete/manage-custom-formFlow';
import { manageTrainingScheduleFlow } from './flows/AdminCenter/Train-Compete/manage-training-scheduleFlow';
import { tournamentCentralFlow } from './flows/AdminCenter/Train-Compete/tournament-centralFlow.ts';

//Marketing
import { discountCodesFlow } from './flows/AdminCenter/Marketing/discount-codes.flow.ts';
import { managePaymentPlansFlow } from './flows/AdminCenter/Marketing/manage-payment-plans.flow.ts';
import { packagesSubscriptionsFlow } from './flows/AdminCenter/Marketing/packages-subscriptions.flow.ts';
import { sketchplayBucksFlow } from './flows/AdminCenter/Marketing/sketchplay-bucks.flow.ts';

//TOurnamen Creation with validation
import { tournamentCreationFlow } from './flows/AdminCenter/Tournament-Central/tournament-creationFlow.ts';
import { tournamentRegistrationFlow } from './flows/AdminCenter/Tournament-Central/tournament-registration.flow.ts';
import { manageTournamentFlow } from './flows/AdminCenter/Tournament-Central/tournament-manageFlow(new).ts';

// Team Management
import { teamManagementFlow } from './flows/AdminCenter/TeamManagement/team-management.flow.ts';

import { tournamentCreaeteTeamFlow } from './flows/AdminCenter/Tournamanet-createTeam/tournamentcreateTeamnFlow.ts';
import { registrationFlow } from './flows/RegistrationFlow/registerFlow.ts';
import { addCommunityFlow } from './flows/RegistrationFlow/addCommunityFlow.ts';
import { eventRegistrationFlow } from './flows/CreateEvent/event-registration.flow.ts';
import { createEventFlow } from './flows/CreateEvent/create-event.flow.ts';
import { handlePopups } from '../utils/popupHandler.ts';


//Feed section for adding Post
import { createPostFlow } from './flows/FeedSection/create-post.flow.ts';
import { updatePostFlow } from './flows/FeedSection/update-post.flow.ts';
import { likePostFlow } from './flows/FeedSection/like-post.flow.ts';
import { commentPostFlow } from './flows/FeedSection/comment-post.flow.ts';
import { deletePostFlow } from './flows/FeedSection/delete-post.flow.ts';
import { quickLinksFlow } from './flows/QuickLinks/quickLinks.flow.ts';
import { customTeamManagementFlow } from './flows/AdminCenter/Tournamanet-createTeam/customTeamManagementFlow.ts';


//🔹 Regression Suite(All Modules)
test.describe('@regression Validate General & Communication Flow', () => {
  test('Manage User Flow', async ({ page }, testInfo) => {
    await manageUserFlow(page, testInfo);
  });

  test('Push Notification Flow', async ({ page }, testInfo) => {
    await pushNotificationFlow(page, testInfo);
  });

  test('Send SMS Flow', async ({ page }, testInfo) => {
    await sendSmsFlow(page, testInfo);
  });

  test('Purchase History Flow', async ({ page }, testInfo) => {
    await purchaseHistoryFlow(page, testInfo);
  });

  test('Send Email Flow', async ({ page }, testInfo) => {
    await sendEmailFlow(page, testInfo);
  });
});

//🔹 Smoke Suite (Minimal Modules)
test.describe('@smoke Validate Training & Compete Flow', () => {

  test('Verify Manage Training Schedule Flow', async ({ page }, testInfo) => {
    await manageTrainingScheduleFlow(page, testInfo);

  });

  test('Verify Manage Child Communities Flow', async ({ page }, testInfo) => {
    await manageChildCommunitiesFlow(page, testInfo);

  });

  test('Verify Tournament Central Flow', async ({ page }, testInfo) => {
    await tournamentCentralFlow(page, testInfo);

  });

  test('Verify Manage Custom Form Flow', async ({ page }, testInfo) => {
    await manageCustomFormFlow(page, testInfo);

  });


});

//🔹 smoke Suite (Selected Modules)
test.describe('@smoke Validate Marketing Flow', () => {
  test('Validate Discount Codes Flow', async ({ page }, testInfo) => {
    await discountCodesFlow(page, testInfo);
  });

  test('manage-payment-plans Flow', async ({ page }, testInfo) => {
    await managePaymentPlansFlow(page, testInfo);
  });


  test('packages Subscriptions Flow', async ({ page }, testInfo) => {
    await packagesSubscriptionsFlow(page, testInfo);
  });

  test('sketchplay Bucks Flow', async ({ page }, testInfo) => {
    await sketchplayBucksFlow(page, testInfo);
  });

});

//🔹 Feed Section
test.describe('@sanity @feed Vlaidate Feed Post Lifecycle', () => {

  test('Create, Update, Like, Comment, Delete Post', async ({ page }, testInfo) => {

    //     // 🔹 Login already handled via globalSetup
    test.setTimeout(90_000);
    await createPostFlow(page, testInfo);
    await updatePostFlow(page, testInfo);
    await commentPostFlow(page, testInfo);
    await likePostFlow(page, testInfo);
    await deletePostFlow(page, testInfo);

  });
});

//🔹 Team Management verification
test.describe('@sanity @TeamManagement Validate Team Management flow', () => {

  test('Roster and coach Verification', async ({ page }, testInfo) => {
    test.setTimeout(120000); // 2 minutes
    await teamManagementFlow(page, testInfo);
  });
});

//🔹 Add pools and brackets and schedule game

test.describe('@sanity @manage Validate Pools & Brackets drag and drop flow', () => {
  test('Manage Tournament Codes Flow', async ({ page }, testInfo) => {
    test.setTimeout(300000);
    const tournamentName = "Pool Tournament Automation";

    await manageTournamentFlow(page, tournamentName, testInfo);


  });
});

// 🔹 Create Custom team flow

test.describe('@sanity @createTeam Validate Custom team Create flow', () => {
  test('Create Custom Team Flow', async ({ page }, testInfo) => {
    test.setTimeout(300000);


    await tournamentCreaeteTeamFlow(page, testInfo);
    await customTeamManagementFlow(page, testInfo);
  });
});



test.describe("@sanity  @tournamentcreate Validate Tournament creation and registrattion flow", () => {
  (["Player", "Team"] as const).forEach((tournamentType) => {
    test(`Create + Update ${tournamentType} Tournament`, async ({ page }, testInfo) => {
      await tournamentCreationFlow(page, testInfo, tournamentType);
    });

    test(`Register in ${tournamentType} Tournament`, async ({ page }, testInfo) => {
      await tournamentRegistrationFlow(page, testInfo, tournamentType);
    });
  });


});

//🔹 Event Suite(Selected Modules)
test.describe('@sanity @event Event creation and register Flow', () => {
  test('Validate Event Creation and Registration Flow', async ({ page }, testInfo) => {
    await createEventFlow(page, testInfo);
    await eventRegistrationFlow(page, testInfo);
  });
});

//🔹 Quick Links
test.describe('@sanity @QuickLinks Verification of Quick Links', () => {

  test('QuickLinks Verification', async ({ page }, testInfo) => {
    test.setTimeout(120000); // 2 minutes
    await quickLinksFlow(page, testInfo);
  });
});


test.describe('@public @register Validate User Registration flow', () => {

  // 🔹 Disable session for all tests in this block
  test.use({ storageState: undefined });

  test('@register Verify Registration and add Community Flow', async ({ page }, testInfo) => {
    await page.goto('/', { waitUntil: 'networkidle' });

    await registrationFlow(page, testInfo);
    //await addCommunityFlow(page, testInfo);
    // 🔥 Handle popups after registration
    await handlePopups(page);

  });
});





//npx playwright test --grep "@sanity|@smoke"
// $env:PWDEBUG="1"
// npx playwright test --grep "@event"
//npx playwright test --grep "@QuickLinks" && npm run -s test:allure && node send-report.js
// npx playwright test --grep "@sanity"; npm run -s test:allure; node send-report.js

