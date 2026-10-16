# Sketchplay Automation — Test Execution Guide

## Prerequisites

- Node.js v18+
- Install dependencies: `npm install`
- Install browsers: `npx playwright install chromium`
- Ensure `.env` is present with `BASE_URL`, `UNAME`, `PASSWORD`

---

## Run All Tests

```bash
npm run test
# or
npx playwright test
```

Runs both Playwright projects (`Sanity Test` + `public`) sequentially.

---

## Run by Tag (grep)

```bash
# Single tag
npx playwright test --grep "@regression"
npx playwright test --grep "@smoke"
npx playwright test --grep "@sanity"
npx playwright test --grep "@createTeam"
npx playwright test --grep "@TeamManagement"
npx playwright test --grep "@manage"
npx playwright test --grep "@event"
npx playwright test --grep "@feed"
npx playwright test --grep "@QuickLinks"
npx playwright test --grep "@register"

# Multiple tags (OR)
npx playwright test --grep "@sanity|@smoke"

# AI schedule tags
npx playwright test --grep "@ai-team"
npx playwright test --grep "@ai-time"
npx playwright test --grep "@ai-court"
npx playwright test --grep "@ai-advanced"
```

---

## Run a Specific Spec File

```bash
npx playwright test tests/sanity.spec.ts
npx playwright test tests/ai_schedule.spec.ts
```

---

## Run a Specific Playwright Project

```bash
# Only authenticated tests
npx playwright test --project="Sanity Test"

# Only registration/public tests
npx playwright test --project="public"
```

---

## Run in UI Mode (interactive)

```bash
npx playwright test --ui
```

Opens the Playwright UI for selecting and running tests visually. Shows test tree, traces, screenshots.

---

## Allure Reports

```bash
# 1. Run tests (results go to allure-results/)
npm run test

# 2. Generate HTML report
npm run test:allure
# equivalent: allure generate allure-results --clean

# 3. Open report in browser
npm run test:report
# equivalent: allure open allure-report
```

> Note: `global-setup.ts` automatically cleans `allure-results/` and `allure-report/` before each run.

---

## Debug Modes

### Playwright Inspector (step through test)
```bash
npx playwright test --debug
# or for a specific test:
npx playwright test --grep "@createTeam" --debug
```

Opens the Playwright Inspector UI. You can step through actions, inspect locators, and see the DOM live.

### Debug on failure only
```bash
npx playwright test --debug-on-failure
```

### Trace viewer (post-run)
Traces are recorded automatically (`trace: 'on'` in config). After a test run:
```bash
npx playwright show-trace test-results/<test-folder>/trace.zip
```

### Enable Playwright debug logs (Windows PowerShell)
```powershell
$env:PWDEBUG="1"
npx playwright test --grep "@event"
```

### VS Code Debugger
Add a `launch.json` configuration:
```json
{
  "type": "node",
  "request": "launch",
  "name": "Playwright Debug",
  "program": "${workspaceFolder}/node_modules/.bin/playwright",
  "args": ["test", "--debug"],
  "console": "integratedTerminal"
}
```

---

## Override Environment Variables

Override without editing `.env`:

```bash
# Windows PowerShell
$env:BASE_URL="https://staging.example.com"; npx playwright test

# Bash/Unix
BASE_URL="https://staging.example.com" npx playwright test
```

---

## Re-generate Auth Session Only

If `auth/state.json` is stale or missing, just run any test — `global-setup.ts` regenerates it automatically before each run.

To manually delete it:
```bash
rm auth/state.json
```

---

## Tag Reference

| Tag | Test Suite | Spec File |
|-----|-----------|-----------|
| `@regression` | General & Communication (5 tests) | `sanity.spec.ts` |
| `@smoke` | Training & Compete (4 tests) | `sanity.spec.ts` |
| `@sanity` | Marketing (4 tests) + Feed + QuickLinks | `sanity.spec.ts` |
| `@Abb` | Tournament Creation & Registration | `sanity.spec.ts` |
| `@manage` | Manage Tournament (pools/brackets) | `sanity.spec.ts` |
| `@createTeam` | Tournament Team Creation + Custom Team | `sanity.spec.ts` |
| `@TeamManagement` | Roster & Coach Verification | `sanity.spec.ts` |
| `@public` | Registration flow | `sanity.spec.ts` |
| `@register` | Registration flow | `sanity.spec.ts` |
| `@event` | Event creation & registration | `sanity.spec.ts` |
| `@feed` | Feed post lifecycle (CRUD) | `sanity.spec.ts` |
| `@QuickLinks` | Quick links verification | `sanity.spec.ts` |
| `@ai-team` | AI schedule team rules | `ai_schedule.spec.ts` |
| `@ai-time` | AI schedule time rules | `ai_schedule.spec.ts` |
| `@ai-court` | AI schedule court rules | `ai_schedule.spec.ts` |
| `@ai-advanced` | AI schedule advanced scenarios | `ai_schedule.spec.ts` |

---

## Notes

- **Workers: 1** — tests run sequentially, never in parallel
- **Retries: 0** — no automatic retry on failure; investigate on first fail
- **MaxFailures: 0** — suite stops on first test failure (set to a higher number if you want full suite runs)
- **Video + Trace + Screenshot: on** — all artifacts saved to `test-results/`
- Most tests require a logged-in session; only `@public` / `@register` skip authentication
