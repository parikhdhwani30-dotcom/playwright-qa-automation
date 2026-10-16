# 🏗️ Playwright Automation - Architecture Guide

This document outlines the detailed code and state management architecture implemented in the Sketchplay Automation project.

---

## 🏗️ 1. Code Architecture: Page-Flow-Test (PFT) Pattern

The project follows a **layered Page Object Model (POM)** structure to ensure maximum reusability and clean test code.

### 📁 **Layer 1: Pages (`/pages`) — Locators & Actions**
- **Purpose**: Represents the "low-level" UI elements and basic interactions.
- **Rules**:
  - Each class corresponds to a specific screen or section.
  - Contains **Locators** (using `getByRole`, `locator`, etc.).
  - Contains **Actions** (e.g., `fillLoginForm`, `clickNextButton`).
  - **No Assertions** in this layer.

### 📁 **Layer 2: Flows (`/tests/flows`) — Business Logic**
- **Purpose**: High-level, reusable business workflows that combine multiple page actions.
- **Example**: `tournament-creation.flow.ts`
  - Involves clicking Admin Center -> Navigating to Tournament Central -> Filling Form -> Uploading Waiver -> Publishing.
- **Benefit**: If the URL or sequence change, we only update the Flow, not every individual test.

### 📁 **Layer 3: Tests/Specs (`/tests`) — Suites & Assertions**
- **Purpose**: The actual test scripts that run.
- **Rules**:
  - Uses `test.describe` and `test` blocks.
  - Calls **Flows** or **Pages**.
  - Contains **Asserts** (e.g., `expect(locator).toBeVisible()`).

---

## 🔐 2. State & Data Management Architecture

### ⚡ **Global Authentication Flow**
To avoid logging in for every test (which is slow), we use Playwright's **Storage State**.

1. **`global-setup.ts`**: 
   - Runs **once** before all tests.
   - Launches a headless browser, logs into the application using credentials from `.env`.
   - Captures the browser's cookies and local storage (session).
   - Saves this state into `auth/state.json`.

2. **Project Configuration (`playwright.config.ts`)**:
   - The `Sanity Test` project is configured to use `storageState: './auth/state.json'`.
   - This marks every test as "already logged in" automatically.

### 🌍 **Environment Management**
We use `dotenv` to handle multiple environments (QA, Dev, Prod).
- **`.env.qa`**: Default variables for QA environment.
- **`.env.dev`**: Variables for the dev environment.
- **Loading Logic**: In `playwright.config.ts`, we dynamically load the file based on the `TEST_ENV` variable.

---

## 🛠️ 3. Major Services & Modules Covered

This suite currently automates the following business modules:

| **Service/Module** | **Description** |
| :--- | :--- |
| **General & Communication** | User management, Push notifications, SMS/Email sending, and Purchase history. |
| **Train & Compete** | Training schedules, Community management, and Tournament Central. |
| **Marketing** | Discount codes, Payment plans, Subscriptions, and Sketchplay Bucks. |
| **Feed Section** | Social interactions: Creating/Updating posts, Likings, and Comments. |
| **Tournament Central** | Complex Player and Team tournament creation and registration flows. |
| **Team Management** | Roster management and Coach verification flows. |
| **Events** | Event registration and management. |
| **Quick Links** | Navigation validation via quick link shortcuts. |

---

## 📈 4. Reporting & Error Handling
- **Allure Reporting**: Integrated via `allure-playwright`.
- **Traces**: Captured on failure (or always, depending on config) to review steps.
- **Screenshots**: Automatically taken on test failure.
- **Videos**: Recorded for debugging complex flows.

---

## ⏭️ Guidelines for New Tasks
1.  **POM First**: Always check if the locator exists in `/pages` before adding it to a test.
2.  **Flow-Based**: If a sequence of actions is used more than twice, move it to `/tests/flows`.
3.  **Tags**: Use `@sanity`, `@smoke`, `@regression`, or project-specific tags (like `@Abb`) for better filtering.
