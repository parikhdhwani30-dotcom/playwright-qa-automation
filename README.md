# 🏗️ Sketchplay Automation Framework

This repository contains the automated End-to-End (E2E) UI testing suite for the SketchPlay application using Playwright in TypeScript.

---

## 🛠️ 1. Tech Stack
- **Testing Framework**: [Playwright](https://playwright.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Data Generation**: [@faker-js/faker](https://fakerjs.dev/)
- **Reporting**: [Allure Report](https://allurereport.org/)
- **Environment Management**: [dotenv](https://www.npmjs.com/package/dotenv)

---

## 🏗️ 2. Code Architecture (POM + Flows)
The project uses a structured **Page-Flow-Test (PFT)** pattern to keep code modular and readable.

- **📁 `pages/`**: Contains **Page Object Model (POM)** classes. These store the locators and basic actions (e.g., `fillInput`, `clickButton`).
- **📁 `tests/flows/`**: Contains **Business Flows**. These combine multiple POM actions into reusable workflows (e.g., `tournamentCreationFlow`).
- **📁 `tests/`**: Contains the **Spec files**. These are the actual test cases where assertions and suite logic reside.

Detailed architecture can be found in [docs/ARCHITECTURE-GUIDE.md](./docs/ARCHITECTURE-GUIDE.md).

---

## 🔐 3. State Management & Authentication
To maximize performance, we use **Playwright's Storage State**:
- **`global-setup.ts`**: Logs in **once** before all tests and saves the authentication session (cookies/storage).
- **`auth/state.json`**: Stores the session file.
- **`playwright.config.ts`**: Configured to reuse this session for tests, bypassing the login step for every test.

---

## 📦 4. Services Covered (Automated Modules)
This automation suite covers the following modules:

- **📤 General & Communication**: User Management, Feedback, SMS/Email triggering.
- **🏆 Train & Compete**: Tournament Central (Player/Team), Coaching schedules.
- **💰 Marketing**: Discount codes, Payment plans, Subscriptions.
- **📱 Feed Section**: Post lifecycle (Create, Update, Like, Comment, Delete).
- **📋 Team Management**: Roster verification and Coach assignment.
- **📅 Events**: Registration and scheduling flows.
- **🔗 Quick Links**: Dashboard shortcut validation.

---

## ⚙️ 5. Setup and Prerequisites
1. **Node.js** (v22.13.0 or higher recommended)
2. **npm** (comes with Node.js)

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

---

## 🧪 6. Running Tests
You can run tests using different tags and project profiles.

```bash
# 1. Run Sanity Suite (Using pre-saved login)
npx playwright test --grep "@sanity"

# 2. Run Registration/Public Tests (Skips saved session)
npx playwright test --grep "@register" --project="public"

# 3. Debug Mode (Headed with Pause)
npx playwright test --grep "@Abb" --debug
```

---

## 📊 7. Reporting (Allure)
Generate and open rich HTML reports after test execution:
```bash
# Generate report
npm run test:allure

# Open report (local server)
npm run test:report
```

---

## 💡 8. Best Practices
- **Never hardcode selectors**: Keep them in the `pages/` layer.
- **Isolate tests**: Each test should be independent of others.
- **Use Flows**: For recurring business sequences, always use `flows/`.
- **Environment control**: Use `TEST_ENV=qa` or `TEST_ENV=dev` to switch environments.
