# Sketchplay Automation — Selectors Reference

Key locators used across the project, grouped by feature area. Use this to avoid re-reading page files when writing or debugging tests.

---

## Login Page

| Element | Selector |
|---------|---------|
| Username field | `#username` |
| Password field | `#password` |
| Login button | `#loginBtn` |
| Dashboard URL pattern | `**/sketchplay-dashboard` |

---

## Navigation / Dashboard

| Element | Selector / Method |
|---------|----------|
| Admin Center card | `div.cursor-pointer` with text `Admin Center` (exact) |
| Admin module cards | `app-admin-center div.cursor-pointer` filtered by text |
| Quick link cards | `div.cursor-pointer` filtered by name |
| Loading spinner | `.spinner`, `[role="progressbar"]`, `.loading` |

---

## Global / Shared

| Element | Selector |
|---------|---------|
| Search textbox | `getByRole('textbox', { name: 'Search...' })` |
| Spinner / progress bar | `.spinner, [role="progressbar"], .loading` |
| Modal dismiss button | `button[dismissmodal]` |
| ng-select dropdown container | `.ng-select-container` |
| ng-select input | `.ng-input input` |
| ng-select options | `.ng-option` / `.ng-option span` |
| Date picker day | `.flatpickr-day[aria-label="<Month Day, Year>"]` |
| Date picker calendar | `.flatpickr-calendar` |
| Validation error messages | `.text-red-500` |

---

## Registration Page

| Element | Selector |
|---------|---------|
| First name | `#signupFirstName` |
| Last name | `#signupLastName` |
| Email | `#signupEmail` |
| Mobile | `#signupMobile` |
| Complete registration button | `#completeRegistrationBtn` |
| OTP inputs | `input[id^="otp_"]` |
| Community selection popup | `app-community-selection` |
| Community dropdown items | `#chooseDefaultCommunity` (multiple elements, use `.nth(index)`) |

---

## Feed Section

| Element | Selector |
|---------|---------|
| Feed nav button | `#feed-nav-btn` |
| Create post input | `#create-post-input` |
| Post content textarea | `#post-content-textarea` |
| Feed post items | `div[id^="feed-post-"]` |
| Like buttons | `button[id^="like-post"]` |
| Post button | `getByRole('button', { name: 'Post' })` |

---

## Create Event

| Element | Selector |
|---------|---------|
| Event type | `#eventType` |
| Event name | `#eventName` |
| Event date picker | `#eventDatePicker` |
| Announcement popup (dismiss) | `button[dismissmodal]` |

---

## Team Management

| Element | Selector |
|---------|---------|
| Add coach button | `#tm_add_coach_btn` |
| Coach first name input | `#tm_coach_first_name_input` |
| Export roster button | `#tm_export_roster_btn` |
| Export team info button | `#tm_export_team_info_btn` |
| User cell in table | `getByRole('cell', { name: userName })` |

---

## Tournament Management

| Element | Selector / Approach |
|---------|---------|
| Tournament name input | Text input inside tournament creation form |
| Waiver PDF upload | `input[type="file"]` (file upload) |
| Tournament dates input | `input[name="tournamentDates"]` |
| Open date input | `getByRole('textbox', { name: 'Choose Open Date' })` |
| Close date input | `getByRole('textbox', { name: 'Choose Close Date' })` |
| Open time | `getByRole('textbox', { name: 'Open Time' })` |
| Close time | `getByRole('textbox', { name: 'Close Time' })` |
| Time hour spinner | `getByRole('spinbutton', { name: 'Hour' })` |
| Time minute spinner | `getByRole('spinbutton', { name: 'Minute' })` |
| Select organization dropdown | `div` containing text `Filter by organization` → `.ng-select-container` |
| Tournament organization dropdown | `div` containing text `Select organization×` → `.ng-select-container` |

---

## AI Schedule Generator

| Element | Selector / Approach |
|---------|---------|
| Rule input textarea | Located inside AI generator panel |
| Submit rule button | Button within AI generator form |
| Location selection | ng-select dropdown |
| Match count display | Text content verified with `toBe(count)` after filtering |

---

## Common Assertion Patterns

```typescript
// Visibility
await expect(locator).toBeVisible();
await expect(locator).toBeVisible({ timeout: 10000 });

// Text content
await expect(page.getByText('Expected Text')).toBeVisible();

// Table cell
await expect(page.getByRole('cell', { name: 'User Name' })).toBeVisible();

// Count / value equality
expect(matchCount).toBe(expectedCount);

// Boolean search result
const found = await basePage.verifyUserSearch('John Doe', testInfo);
expect(found).toBe(true);
```

---

## Selector Strategy Notes

1. **Prefer IDs** (`#loginBtn`, `#username`) — most stable
2. **Use `getByRole`** for semantic elements (buttons, cells, textboxes) — resilient to styling changes
3. **Filter by text** for cards/modules: `.locator('div.cursor-pointer').filter({ hasText: /name/i })`
4. **Use `.first()`** when multiple matches are expected — avoids strict mode errors
5. **Avoid CSS classes** for assertions — use for navigation only (e.g., `.ng-select-container`)
6. **`nth(index)`** for community selection (`#chooseDefaultCommunity` returns multiple elements)
7. **`{ force: true }`** on click for elements that may have overlay/animation issues
