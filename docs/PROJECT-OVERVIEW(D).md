# 🚀 Project Overview: Sketchplay Automation

## 🎯 Goal
To provide a robust, scalable, and high-speed automated testing solution for the Sketchplay platform, ensuring that critical business flows (Tournament, Registration, Marketing, etc.) are always functional.

## 🏗️ Technical Foundation
- **Framework**: Playwright (TS) + Page Object Model.
- **State**: Centralized login via Global Setup.
- **Reporting**: Allure + Automated Email Triggers.

## 📦 Key Modules Explained

### 1. Tournament Central
- **Complexity**: High
- **Flows**: Dynamic creation of Player vs Team tournaments. Handles multi-step forms, waiver uploads, and registration logic in new tabs.
- **Key Files**: `tournament-creation.flow.ts`, `tournament-registration.page.ts`.

### 2. Marketing & Finance
- **Flows**: Validation of discount codes, processing subscriptions, and verifying "Sketchplay Bucks" balance logic.

### 3. User & Communication
- **Flows**: Testing the ability to send SMS, Email, and Push notifications to users. Verification of Purchase History records.

### 4. Feed & Social
- **Flows**: Full CRUD operations for dashboard posts (Create, Read, Update, Delete) + Social interactions (Like, Comment).

---

## 🛠️ Internal "Rules of Engagement" for AI/Developers
- **Environment**: Always check the `BASE_URL` in `.env.qa`.
- **Debugging**: If a test fails on an `ng-select`, check if the role is `combobox` instead of `textbox`.
- **Headless**: Keep `headless: true` for the login setup to save time (Speed matter).
- **Timeouts**: Dashboard navigation typically needs around 10-15s wait.
