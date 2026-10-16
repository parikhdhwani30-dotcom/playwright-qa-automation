# Community Popup Handler - Fixed ✅

## What Was Fixed

### Problem
The popup handler wasn't clicking the community selection because:
1. Wrong selector - was using `div[tabindex="0"].cursor-pointer` 
2. The correct selector is `#chooseDefaultCommunity` (multiple elements with same ID)

### Solution
Updated `utils/popupHandler.ts` to:
1. ✅ Check if `app-community-selection` popup exists
2. ✅ Find all communities using `#chooseDefaultCommunity`
3. ✅ Click the 2nd community (index 1) - "Client11"
4. ✅ Wait for Submit button to be enabled
5. ✅ Click Submit button
6. ✅ Gracefully skip if popup doesn't exist (like announcement popup)

## How It Works Now

```typescript
// 1. Check if popup exists
const communityPopup = page.locator('app-community-selection');
const popupExists = await communityPopup.isVisible();

if (popupExists) {
  // 2. Find all community options
  const communities = page.locator('#chooseDefaultCommunity');
  
  // 3. Click 2nd community
  await communities.nth(1).click();
  
  // 4. Click Submit
  const submitBtn = page.getByRole('button', { name: 'Submit' });
  await submitBtn.click();
} else {
  // Skip if no popup
}
```

## Debug Mode

The handler now has an optional debug parameter:

```typescript
// Enable debug logs
await handlePopups(page, "context-name", true);

// Disable debug logs (cleaner output)
await handlePopups(page, "context-name", false);
```

### Current Usage:
- ✅ `global-setup.ts` - debug OFF (no popup expected during login)
- ✅ `sanity.spec.ts` (@register test) - debug ON (popup expected after registration)

## Testing

Run the registration test to see it in action:

```bash
npx playwright test --grep "@register" --headed
```

Expected output:
```
🌍 Community selection popup detected
🔍 Found 4 community options
🔍 Community 0: "Sketchplay"
🔍 Community 1: "Client11"
🔍 Community 2: "Client 999"
🔍 Community 3: "Clientnew777"
✅ Selected 2nd community
🔍 Submit button enabled: true
✅ Submit button clicked
```

## Customization

### Select Different Community
Change the index in `popupHandler.ts`:

```typescript
// Select 1st community (Sketchplay)
await communities.nth(0).click();

// Select 2nd community (Client11) - current
await communities.nth(1).click();

// Select 3rd community (Client 999)
await communities.nth(2).click();
```

### Select by Name
```typescript
// Find by text
const community = page.locator('#chooseDefaultCommunity', { 
  hasText: 'Client11' 
});
await community.click();
```

## Edge Cases Handled

✅ No popup appears → Skips gracefully  
✅ Only 1 community → Selects it automatically  
✅ Multiple communities → Selects 2nd one  
✅ Submit disabled → Waits and checks before clicking  
✅ Submit not found → Logs error but doesn't fail  

## Clean Up

Once confirmed working, you can:
1. Remove debug logs by setting `debug: false`
2. Remove `DEBUG-GUIDE.md` if no longer needed
3. Keep error handling and screenshots for production use
