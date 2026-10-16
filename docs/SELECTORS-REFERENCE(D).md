# 🎯 Selectors Reference Guide

This document defines the best practices and common patterns for choosing locators in the Sketchplay project.

---

## 🔝 1. Primary Strategy: User-Centric Roles
We prioritize Playwright's **Accessibility Roles** over CSS selectors or XPaths. This ensures our tests are resilient to UI changes.

| **Element Type** | **Preferred Locator** |
| :--- | :--- |
| **Buttons** | `page.getByRole('button', { name: 'Submit' })` |
| **Inputs** | `page.getByRole('textbox', { name: 'Email' })` |
| **Checkboxes** | `page.getByRole('checkbox')` |
| **Dropdowns** | `page.getByRole('combobox')` |
| **Headings** | `page.getByRole('heading', { level: 1 })` |

---

## 🔄 2. Handling `ng-select` Dropdowns
The `ng-select` components in Sketchplay can be tricky. Here is the standard way to interact with them:

```typescript
// Click the dropdown first
const dropdown = popup.locator("ng-select")
  .filter({ hasText: "Choose Registration Tier" })
  .getByRole("combobox"); // Use 'combobox' instead of 'textbox'
  
await dropdown.click();

// Select from the popup panel (which appears at the body level)
await popup.locator(".ng-dropdown-panel .ng-option").first().click();
```

---

## 🖼️ 3. Popups & New Tabs
If a page opens in a new tab (e.g., the registration page):

```typescript
const [popup] = await Promise.all([
  page.waitForEvent('popup'),
  page.click('#registrationButton')
]);

// Use 'popup' instead of 'page' for interactions
await popup.getByRole('textbox').fill('Value');
```

---

## 🚫 4. Anti-Patterns (What to Avoid)
- **❌ Absolute XPath**: `/html/body/div[1]/...` (Breaks easily).
- **❌ Brittle CSS Classes**: `.btn-primary-blue-v2` (Styling changes often).
- **❌ Dynamic IDs**: `#ac24518b0695` (These rotate every session).

---

## 💡 5. Custom Strategies
If roles don't work, use **Text Content** or **Aria Labels**:
- `page.getByLabel('Search')`
- `page.getByText('File uploaded successfully')`
- `page.locator('div.card').filter({ hasText: 'Tournament Name' })`
