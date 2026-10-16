# Sketchplay Automation — Claude Instructions

## Always read these files at the start of every task

@docs/PROJECT-OVERVIEW.md
@docs/TEST-COVERAGE-MAP.md
@docs/ARCHITECTURE-GUIDE.md
@docs/SELECTORS-REFERENCE.md
@docs/TEST-EXECUTION-GUIDE.md

## Project context

This is a Playwright + TypeScript end-to-end automation suite for the **Sketchplay** web application.
- Pattern: Page Object Model (POM) + Flow-based testing
- Browser: Chromium only, headless:false, maximized window
- Auth: global-setup saves session to `auth/state.json`; reused by "Sanity Test" project
- Reports: Allure (generate with `npm run test:allure`, view with `npm run test:report`)
- Workers: 1 (sequential), Retries: 0

## Guidelines

- Before writing any new test or page object, check TEST-COVERAGE-MAP.md to see if it already exists
- Follow the POM + Flow pattern described in ARCHITECTURE-GUIDE.md
- Use selectors from SELECTORS-REFERENCE.md before inventing new ones
- Run commands exactly as documented in TEST-EXECUTION-GUIDE.md
