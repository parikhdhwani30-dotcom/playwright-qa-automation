# 📖 Test Execution Guide

This document explains the different ways to execute and monitor automated tests in the Sketchplay project.

---

## 🏃 1. Standard Run: Headless Mode
Most CI/CD pipelines and background runs should use these commands.

```bash
# 🥇 Run Sanity Suite (Uses saved session)
npx playwright test --grep "@sanity"

# 🥈 Run Smoke Suite (Fastest Check)
npx playwright test --grep "@smoke"

# 🥉 Run Everything (Longest Run)
npx playwright test
```

---

## 🔍 2. Debugging: Headed Mode
If you need to see the browser window and interact with the UI:

```bash
# ⚡ UI Mode (Interactive GUI) - RECOMMENDED
npx playwright test --ui

# 🕵️‍♂️ Inspector Mode (Pause after each step)
# This will open the Playwright Inspector in a separate window
npx playwright test --grep "@Abb" --debug

# 📈 Trace Viewer
# If a test fails, you can open the recorded trace
npx playwright show-trace test-results/trace.zip
```

---

## 📊 3. Reporting & Email Logic
Reports are generated using Allure. We also have a custom email script.

```bash
# 👇 Proper command sequence (Always triggers report/mail)
npx playwright test --grep "@QuickLinks"; npm run test:allure; node send-report.js
```

### Why use `;` instead of `&&`?
- **`;`**: Ensures `allure generate` and `send-report.js` run even if the tests fail.
- **`&&`**: Would stop immediately on failure, preventing you from receiving the failure report via email.

---

## ✅ 4. Common Execution Settings
- **`--workers=1`**: Use this if tests are conflicting over the same data/user.
- **`--timeout=0`**: Use this when manually debugging to prevent timeout errors.
- **`--headed`**: Run normally but show the browser window without pausing.
- **`--project="public"`**: To skip the pre-saved login state for registration tests.

---

## 🖥️ 5. Environments
- Use **`TEST_ENV=qa`** (default) or **`TEST_ENV=dev`** in your command line or `.env` file to switch environments.
- Environment variables are automatically loaded by `dotenv`.
