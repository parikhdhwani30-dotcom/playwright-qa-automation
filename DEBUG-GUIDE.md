# Debugging Guide for popupHandler.ts

## What Was Added

### 1. Enhanced Console Logging
- Detailed step-by-step logs with `🔍 [DEBUG]` prefix
- Counts of elements found
- Visibility and enabled state checks
- Text content of buttons and elements

### 2. Debugger Breakpoint
The `debugger;` statement will pause execution when:
- Running with `--debug` flag
- Running in headed mode with DevTools open
- Using VS Code debugger

### 3. Debug Helper Function
```typescript
debugPageState(page, "label")
```
- Logs current URL
- Can be uncommented to use `page.pause()` for Playwright Inspector

### 4. Error Screenshots
Automatically saves screenshots to `screenshots/` folder when errors occur

## How to Debug

### Method 1: Using Console Logs (Easiest)
```bash
npx playwright test --grep "@register" --headed
```
Watch the console output for detailed logs showing:
- How many community items found
- Which buttons are visible/enabled
- What happens at each step

### Method 2: Using Debugger Statement
```bash
npx playwright test --grep "@register" --headed --debug
```
- Execution will pause at the `debugger;` line
- Open browser DevTools (F12)
- Step through code line by line
- Inspect variables in the console

### Method 3: Using Playwright Inspector
In `popupHandler.ts`, uncomment this line in `debugPageState()`:
```typescript
await page.pause();
```

Then run:
```bash
npx playwright test --grep "@register" --headed
```
- Playwright Inspector will open
- You can inspect the page visually
- Step through actions one by one
- See element highlights

### Method 4: VS Code Debugger
1. Add breakpoint in VS Code (click left of line number)
2. Run test in debug mode from VS Code
3. Use VS Code's debug controls

## Common Issues to Check

### Issue: Community not clicking
**Check in logs:**
- Is `count > 0`?
- Is community item visible?
- What's the text content?

**Possible fixes:**
- Change `nth(1)` to `nth(0)` (first item instead of second)
- Increase timeout
- Check if selector changed

### Issue: Submit button not found
**Check in logs:**
- Is `submitExists > 0`?
- Is button visible/enabled?
- What are the other button texts on page?

**Possible fixes:**
- Button text might be different (e.g., "Continue", "Next")
- Button might be in a different role
- Try: `page.locator('button:has-text("Submit")')`

### Issue: Submit button disabled
**Check:**
- Screenshot saved in `screenshots/submit-disabled-*.png`
- Is community selection actually working?
- Does UI need more time to enable button?

**Possible fixes:**
- Increase wait time after community click
- Add explicit wait: `await submitBtn.waitFor({ state: 'visible' })`
- Check if form validation is blocking

## Quick Debugging Commands

```bash
# Run with full debug output
npx playwright test --grep "@register" --headed --debug

# Run and keep browser open on failure
npx playwright test --grep "@register" --headed --debug-on-failure

# Run with trace (review in Playwright Trace Viewer)
npx playwright test --grep "@register" --trace on

# View trace after test
npx playwright show-trace trace.zip
```

## Reading the Debug Output

Look for these patterns:

✅ **Success indicators:**
```
✅ Selected 2nd community
🟦 Submit clicked successfully
```

⚠️ **Warning indicators:**
```
⚠️ Submit is disabled → skipping
ℹ️ No community items found
```

❌ **Error indicators:**
```
❌ Submit button not found on page
⚠️ Error in popup handler:
```

## Next Steps After Debugging

Once you identify the issue:
1. Note the exact selector that works
2. Update the locator in `popupHandler.ts`
3. Remove or comment out excessive debug logs
4. Keep the error handling and screenshots
