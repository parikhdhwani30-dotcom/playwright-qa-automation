# Sketchplay Automation — Architecture Guide

## Pattern: Page Object Model (POM) + Flow-Based Testing

```
Test Spec (.spec.ts)
    └── calls Flow functions (.flow.ts / Flow.ts)
            └── calls Page Object methods (.page.ts)
                    └── extends BasePage (pages/baseFile.ts)
```

Each layer has a single responsibility:
- **Spec**: declares test suites, tags, timeouts, calls flows
- **Flow**: orchestrates one business scenario end-to-end
- **Page Object**: encapsulates locators and atomic actions for one page/feature
- **BasePage**: shared navigation, dropdowns, search, date pickers, screenshots

---

## BasePage (`pages/baseFile.ts`)

All page objects extend `BasePage`. Available shared methods:

| Method | Signature | Purpose |
|--------|-----------|---------|
| `navigate()` | `async navigate()` | Go to `this.baseUrl` |
| `waitForSpinner()` | `async waitForSpinner()` | Wait for loading spinners to disappear |
| `navigateToAdminCenter()` | `async navigateToAdminCenter()` | Click Admin Center card from dashboard |
| `navigateToAdmin(moduleName)` | `async navigateToAdmin(name: string)` | Click a module card inside Admin Center |
| `navigateToModule(name, nthIndex?)` | `async navigateToModule(name, idx=4)` | Navigate via nth-matched `app-admin-center div` |
| `navigateToAnyModule(name)` | `async navigateToAnyModule(name: string)` | Click first `div.cursor-pointer` matching name |
| `selectOrganization(orgName)` | `async selectOrganization(name: string)` | Select from "Filter by organization" ng-select dropdown |
| `selectTournamentOrganization(orgName)` | `async selectTournamentOrganization(name: string)` | Select from "Select organization" ng-select dropdown |
| `searchUser(userName)` | `async searchUser(name: string)` | Fill Search... textbox and press Enter |
| `verifyUserSearch(userName, testInfo)` | `async verifyUserSearch(...): Promise<boolean>` | Assert user exists in table cell |
| `verifyUserSearchColumn(userName, testInfo)` | `async verifyUserSearchColumn(...): Promise<boolean>` | Assert user in multiple cells |
| `takeScreenshot(testInfo, name, page?)` | `protected async takeScreenshot(...)` | Attach PNG to Allure |
| `selectNgDropdownByIndex(locator, index)` | `async selectNgDropdownByIndex(loc, idx)` | Open ng-select, pick option by index |
| `selectTournamentDates()` | `async selectTournamentDates()` | Pick today → today+6 in flatpickr |
| `pickOpenCloseDates(...)` | `async pickOpenCloseDates(openH, openM, closeH, closeM)` | Set open/close dates with time |

---

## Creating a New Page Object

1. Create file at `pages/<FeatureArea>/<feature-name>.page.ts`
2. Extend `BasePage`
3. Declare all locators in the constructor

```typescript
import { Page } from '@playwright/test';
import { BasePage } from '../baseFile';

export class MyFeaturePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async doSomething() {
    await this.page.click('#some-button');
    await this.waitForSpinner();
  }
}
```

---

## Creating a New Flow

1. Create file at `tests/flows/<FeatureArea>/<feature-name>.flow.ts`
2. Export a single async function
3. Import and compose page objects

```typescript
import { Page, TestInfo } from '@playwright/test';
import { attachScreenshot } from '../../../utils/allureScreenshot';
import { MyFeaturePage } from '../../../pages/MyFeature/my-feature.page';

export async function myFeatureFlow(page: Page, testInfo: TestInfo) {
  const featurePage = new MyFeaturePage(page);

  await featurePage.navigateToAdminCenter();
  await featurePage.navigateToAdmin('My Feature');
  await featurePage.doSomething();

  await attachScreenshot(page, testInfo, 'my-feature-done');
}
```

---

## Adding a Test to sanity.spec.ts

1. Import the flow at the top of `tests/sanity.spec.ts`
2. Add a `test.describe` block with a tag and timeout

```typescript
import { myFeatureFlow } from './flows/MyFeature/my-feature.flow.ts';

test.describe('@myTag My Feature Tests', () => {
  test('Verify My Feature', async ({ page }, testInfo) => {
    test.setTimeout(120000);
    await myFeatureFlow(page, testInfo);
  });
});
```

3. To activate a dormant test: **uncomment** the existing `test.describe` block.

---

## Authentication Strategy

```
global-setup.ts (runs once before all tests)
    ├── Clean allure-results/ and allure-report/
    ├── Detect @public/@register → skip login
    ├── Launch headless Chromium
    ├── Fill #username, #password, click #loginBtn
    ├── Wait for **/sketchplay-dashboard (15s)
    ├── handlePopups() — dismiss notifications
    └── Save session → auth/state.json

playwright.config.ts
    ├── "Sanity Test" project → storageState: './auth/state.json'
    └── "public" project    → storageState: undefined
```

For registration tests that need a fresh session:
```typescript
test.use({ storageState: undefined });
```

---

## Popup Handling (`utils/popupHandler.ts`)

```typescript
import { handlePopups } from '../utils/popupHandler';

await handlePopups(page);
```

- Waits 1.5s for popup to render
- Looks for `button[dismissmodal]`
- Clicks with `{ force: true }` if visible
- Silently skips if no popup present

For community-selection popups (post-registration), see `POPUP-HANDLER-FIXED.md`.

---

## Screenshot Attachment (`utils/allureScreenshot.ts`)

```typescript
import { attachScreenshot } from '../../../utils/allureScreenshot';

await attachScreenshot(page, testInfo, 'step-name');
```

- Takes a **full-page** screenshot
- Attaches it to the Allure report with the given name
- Use after key steps for traceability

---

## Data-Driven Tests (AI Schedule Generator)

Test scenarios live in `tests/data/*.json`. The TypeScript interface is `tests/types/ScheduleRules.ts`.

```typescript
// ScheduleTestCase interface fields:
{
  scenarioName: string;
  rulesToType: string[];        // rules to type into the AI generator
  expectedAssertions: {
    // time rules
    noMatchesBefore?: string;
    noMatchesAfter?: string;
    // court rules
    courtBlockedTimes?: string[];
    noMatchesOnCourt?: string;
    // team rules
    teamMaxMatchesPerDay?: number;
    teamMustPlayOnCourt?: string;
    teamsCannotPlaySimultaneously?: string[];
    // ...
  };
}
```

---

## Faker Usage (Registration Flows)

```typescript
import { faker } from '@faker-js/faker';

const firstName = faker.person.firstName();
const email = faker.internet.email();
const phone = faker.phone.number('##########');
```

---

## Naming Conventions

| Artifact | Convention | Example |
|----------|-----------|---------|
| Page Object file | `kebab-case.page.ts` | `manage-user.page.ts` |
| Flow file | `kebab-case.flow.ts` or `camelCaseFlow.ts` | `send-emailFlow.ts` |
| Spec file | `name.spec.ts` | `sanity.spec.ts` |
| Page class | `PascalCase + Page` | `ManageUserPage` |
| Flow function | `camelCase + Flow` | `manageUserFlow` |
| Test tag | `@camelCase` | `@regression`, `@createTeam` |
