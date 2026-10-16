# Sketchplay Automation — Project Overview

## Purpose
End-to-end UI automation suite for the **Sketchplay** web application using Playwright + TypeScript. Covers Admin Center modules, tournament management, event/feed features, registration, and AI schedule generation.

---

## Tech Stack

| Tool | Version | Purpose |
|------|---------|---------|
| `@playwright/test` | ^1.55.0 | Test framework & browser automation |
| TypeScript | — | Language |
| `allure-playwright` | ^3.3.0 | Test reporting |
| `@faker-js/faker` | ^9.9.0 | Dynamic test data generation |
| `dotenv` | ^16.5.0 | Environment variable loading |
| `fs-extra` | ^11.3.2 | File system operations in setup |

---

## Directory Structure

```
sketchplay-automation-playwright/
├── pages/                    # Page Object Model classes (27 files)
│   ├── baseFile.ts           # BasePage — shared helpers for all pages
│   └── AdminCenter/
│       ├── General-Communication/  (5 pages)
│       ├── Marketing/              (4 pages)
│       ├── TeamManagement/         (1 page)
│       ├── Tournamanet-createTeam/ (2 pages)
│       ├── Tournament-Central/     (3 pages)
│       └── Train-Compete/          (4 pages)
│   ├── AI_Schedule_Generator/  (1 page)
│   ├── CreateEvent/            (2 pages)
│   ├── FeedSection/            (1 page)
│   ├── QuickLinks/             (1 page)
│   └── RegistrationPage/       (2 pages)
│
├── tests/
│   ├── sanity.spec.ts          # Main spec (all flows, most commented out)
│   ├── ai_schedule.spec.ts     # AI schedule generator spec
│   ├── flows/                  # Business logic / orchestration (33 files)
│   │   └── AdminCenter/ | CreateEvent/ | FeedSection/ | QuickLinks/ | RegistrationFlow/ | AI_Schedule_Generator/
│   ├── data/                   # JSON test data
│   │   ├── courtRules.json
│   │   ├── teamRules.json
│   │   └── timeRules.json
│   └── types/
│       └── ScheduleRules.ts    # TypeScript interfaces for AI schedule test cases
│
├── utils/
│   ├── popupHandler.ts         # Dismiss notification popups
│   └── allureScreenshot.ts     # Attach full-page screenshots to Allure
│
├── auth/
│   └── state.json              # Saved browser session (auto-generated)
│
├── files/                      # Upload fixtures
│   ├── roster-template.xlsx
│   ├── Confidentiality Agreement.pdf
│   ├── UpdatedConfidentialityAgreement.pdf
│   └── download.jpg
│
├── downloads/                  # Files downloaded during test runs
├── screenshots/                # Screenshots captured during tests
│
├── playwright.config.ts        # Playwright configuration
├── global-setup.ts             # Pre-test login and cleanup
├── package.json
└── .env                        # Credentials & base URL (not committed)
```

---

## Environment Variables (`.env`)

```
BASE_URL=https://web.devtrack.net/account-login
UNAME=lance@sketchplay.com
PASSWORD=Test123!
```

> Alternate credentials are commented out in `.env` for reference.

---

## NPM Scripts

| Command | What it does |
|---------|-------------|
| `npm run test` | Run all tests |
| `npm run test:allure` | Generate Allure HTML report from results |
| `npm run test:report` | Open the Allure report in browser |

---

## Playwright Projects

Two projects are configured in `playwright.config.ts`:

| Project | Name | Grep Filter | Auth |
|---------|------|-------------|------|
| Authenticated | `Sanity Test` | Skips `@register \| @public` | `./auth/state.json` |
| Public/Registration | `public` | Only `@register \| @public` | No saved session |

### Shared Settings (both projects)
- Browser: Chromium (no channel — stock build)
- Launch args: `--start-maximized`, `--disable-cache`, `--disk-cache-size=0`
- `headless: false`
- `viewport: null` (maximized)
- `trace: 'on'`, `video: 'on'`, `screenshot: 'on'`
- `bypassCSP: true`, `ignoreHTTPSErrors: true`
- Retries: `0` | Workers: `1` | MaxFailures: `0`

---

## Authentication Strategy

1. `global-setup.ts` runs **once** before any test
2. Cleans Allure output folders
3. Detects if `@public` / `@register` tags are in use → skips login
4. Launches **headless** Chromium (fast), logs in via `#username` / `#password` / `#loginBtn`
5. Waits for `**/sketchplay-dashboard`
6. Calls `handlePopups()` to dismiss any notification overlays
7. Saves session to `./auth/state.json`
8. "Sanity Test" project reuses this state via `storageState`

---

## Allure Reporting

- Results written to `allure-results/` during test run
- `global-setup.ts` cleans both `allure-results/` and `allure-report/` before each run
- Generate: `npm run test:allure` → `allure generate allure-results --clean`
- View: `npm run test:report` → `allure open allure-report`
- Screenshots attached inline via `attachScreenshot()` utility

---

## Key Patterns

- **POM + Flow**: Page Object classes hold locators/actions; Flow functions orchestrate them into scenarios
- **Test tagging**: Each `test.describe` block is prefixed with a tag (e.g. `@regression`, `@smoke`) for grep filtering
- **Data-driven AI tests**: JSON files in `tests/data/` drive the AI schedule generator test scenarios
- **Faker**: Used in registration flows for generating realistic random user data
