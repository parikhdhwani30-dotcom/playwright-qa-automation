# Sketchplay Automation — Test Coverage Map

Shows every feature area, its files, test tag, and current activation status.

**Status key:** `ACTIVE` = running in CI/test runs | `DORMANT` = commented out, code exists

---

## Admin Center — General & Communication

| Test | Flow File | Page File | Tag | Status |
|------|-----------|-----------|-----|--------|
| Manage User | `flows/AdminCenter/General-Communication/manage-userFlow.ts` | `pages/AdminCenter/General-Communication/manage-user.page.ts` | `@regression` | DORMANT |
| Push Notification | `flows/AdminCenter/General-Communication/push-notificationFlow.ts` | `pages/AdminCenter/General-Communication/push-notification.page.ts` | `@regression` | DORMANT |
| Send SMS | `flows/AdminCenter/General-Communication/send-smsFlow.ts` | `pages/AdminCenter/General-Communication/send-sms.page.ts` | `@regression` | DORMANT |
| Purchase History | `flows/AdminCenter/General-Communication/purchase-historyFlow.ts` | `pages/AdminCenter/General-Communication/purchase-history.page.ts` | `@regression` | DORMANT |
| Send Email | `flows/AdminCenter/General-Communication/send-emailFlow.ts` | `pages/AdminCenter/General-Communication/send-email.page.ts` | `@regression` | DORMANT |

---

## Admin Center — Training & Compete

| Test | Flow File | Page File | Tag | Status |
|------|-----------|-----------|-----|--------|
| Manage Training Schedule | `flows/AdminCenter/Train-Compete/manage-training-scheduleFlow.ts` | `pages/AdminCenter/Train-Compete/manage-training-schedule.page.ts` | `@smoke` | DORMANT |
| Manage Child Communities | `flows/AdminCenter/Train-Compete/manage-child-communitiesFlow.ts` | `pages/AdminCenter/Train-Compete/manage-child-communities.page.ts` | `@smoke` | DORMANT |
| Tournament Central | `flows/AdminCenter/Train-Compete/tournament-centralFlow.ts` | `pages/AdminCenter/Train-Compete/tournament-central.page.ts` | `@smoke` | DORMANT |
| Manage Custom Form | `flows/AdminCenter/Train-Compete/manage-custom-formFlow.ts` | `pages/AdminCenter/Train-Compete/manage-custom-form.page.ts` | `@smoke` | DORMANT |

---

## Admin Center — Marketing

| Test | Flow File | Page File | Tag | Status |
|------|-----------|-----------|-----|--------|
| Discount Codes | `flows/AdminCenter/Marketing/discount-codes.flow.ts` | `pages/AdminCenter/Marketing/discount-codes.page.ts` | `@sanity` | DORMANT |
| Manage Payment Plans | `flows/AdminCenter/Marketing/manage-payment-plans.flow.ts` | `pages/AdminCenter/Marketing/manage-payment-plans.page.ts` | `@sanity` | DORMANT |
| Packages & Subscriptions | `flows/AdminCenter/Marketing/packages-subscriptions.flow.ts` | `pages/AdminCenter/Marketing/packages-subscriptions.page.ts` | `@sanity` | DORMANT |
| SketchPlay Bucks | `flows/AdminCenter/Marketing/sketchplay-bucks.flow.ts` | `pages/AdminCenter/Marketing/sketchplay-bucks.page.ts` | `@sanity` | DORMANT |

---

## Admin Center — Tournament Central

| Test | Flow File | Page File | Tag | Status |
|------|-----------|-----------|-----|--------|
| Tournament Creation | `flows/AdminCenter/Tournament-Central/tournament-creationFlow.ts` | `pages/AdminCenter/Tournament-Central/tournament-creation-updation.page.ts` | `@Abb` | DORMANT |
| Tournament Registration | `flows/AdminCenter/Tournament-Central/tournament-registration.flow.ts` | `pages/AdminCenter/Tournament-Central/tournament-registration.page.ts` | `@Abb` | DORMANT |
| Manage Tournament (pools/brackets) | `flows/AdminCenter/Tournament-Central/tournament-manageFlow(new).ts` | `pages/AdminCenter/Tournament-Central/tournament-manage.page(new).ts` | `@manage` | DORMANT |

---

## Admin Center — Team Management

| Test | Flow File | Page File | Tag | Status |
|------|-----------|-----------|-----|--------|
| Roster & Coach Verification | `flows/AdminCenter/TeamManagement/TeamManagementflow.ts` | `pages/AdminCenter/TeamManagement/TeamManagementPage.ts` | `@sanity @TeamManagement` | **ACTIVE** |

---

## Admin Center — Tournament Create Team

| Test | Flow File | Page File | Tag | Status |
|------|-----------|-----------|-----|--------|
| Create Tournament Team | `flows/AdminCenter/Tournamanet-createTeam/tournamentcreateTeamnFlow.ts` | `pages/AdminCenter/Tournamanet-createTeam/tournament-createTeam.page.ts` | `@createTeam` | **ACTIVE** |
| Custom Team Management | `flows/AdminCenter/Tournamanet-createTeam/customTeamManagementFlow.ts` | `pages/AdminCenter/Tournamanet-createTeam/customTeamManagement.page.ts` | `@createTeam` | **ACTIVE** |

---

## Registration

| Test | Flow File | Page File | Tag | Status |
|------|-----------|-----------|-----|--------|
| User Registration | `flows/RegistrationFlow/registerFlow.ts` | `pages/RegistrationPage/registerPage.ts` | `@public @register` | DORMANT |
| Add Community | `flows/RegistrationFlow/addCommunityFlow.ts` | `pages/RegistrationPage/addCommunityPage.ts` | `@public @register` | DORMANT |

---

## Create Event

| Test | Flow File | Page File | Tag | Status |
|------|-----------|-----------|-----|--------|
| Create Event | `flows/CreateEvent/create-event.flow.ts` | `pages/CreateEvent/create-event.page.ts` | `@event` | DORMANT |
| Event Registration | `flows/CreateEvent/event-registration.flow.ts` | `pages/CreateEvent/event-registration.page.ts` | `@event` | DORMANT |

---

## Feed Section

| Test | Flow File | Page File | Tag | Status |
|------|-----------|-----------|-----|--------|
| Create Post | `flows/FeedSection/create-post.flow.ts` | `pages/FeedSection/feed.page.ts` | `@sanity @feed` | DORMANT |
| Update Post | `flows/FeedSection/update-post.flow.ts` | `pages/FeedSection/feed.page.ts` | `@sanity @feed` | DORMANT |
| Comment on Post | `flows/FeedSection/comment-post.flow.ts` | `pages/FeedSection/feed.page.ts` | `@sanity @feed` | DORMANT |
| Like Post | `flows/FeedSection/like-post.flow.ts` | `pages/FeedSection/feed.page.ts` | `@sanity @feed` | DORMANT |
| Delete Post | `flows/FeedSection/delete-post.flow.ts` | `pages/FeedSection/feed.page.ts` | `@sanity @feed` | DORMANT |

---

## Quick Links

| Test | Flow File | Page File | Tag | Status |
|------|-----------|-----------|-----|--------|
| Quick Links Verification | `flows/QuickLinks/quickLinks.flow.ts` | `pages/QuickLinks/QuickLinksPage.ts` | `@sanity @QuickLinks` | DORMANT |

---

## AI Schedule Generator

Spec file: `tests/ai_schedule.spec.ts`

| Test | Flow File | Page File | Tag | Status |
|------|-----------|-----------|-----|--------|
| Time Availability Rules | `flows/AI_Schedule_Generator/timeRulesFlow.ts` | `pages/AI_Schedule_Generator/AIScheduleGeneratorPage.ts` | `@ai-time` | DORMANT |
| Court Availability Rules | `flows/AI_Schedule_Generator/courtRulesFlow.ts` | `pages/AI_Schedule_Generator/AIScheduleGeneratorPage.ts` | `@ai-court` | DORMANT |
| Team Specific Rules | `flows/AI_Schedule_Generator/teamRulesFlow.ts` | `pages/AI_Schedule_Generator/AIScheduleGeneratorPage.ts` | `@ai-team` | **ACTIVE** |
| Advanced Scenarios | `flows/AI_Schedule_Generator/advancedScenariosFlow.ts` | `pages/AI_Schedule_Generator/AIScheduleGeneratorPage.ts` | `@ai-advanced` | DORMANT |

---

## Summary

| Status | Count |
|--------|-------|
| ACTIVE | 4 tests |
| DORMANT (code ready) | ~30 tests |
| **Total** | **~34 tests** |

### Active Tests (currently running)
1. `@createTeam` → Create Tournament Team + Custom Team Management
2. `@sanity @TeamManagement` → Roster & Coach Verification
3. `@ai-team` → Team Specific AI Schedule Rules

### Untested / No Coverage
- No CI/CD pipeline tests
- No API-level tests
- No cross-browser tests (Chromium only)
- No mobile viewport tests
