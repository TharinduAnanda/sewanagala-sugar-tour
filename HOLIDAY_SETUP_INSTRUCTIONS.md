# 🎉 Add Mercantile Holidays to Google Calendar - Quick Guide

## Step 1: Update OAuth Scope (Required for Write Access)

The current OAuth setup is **read-only**. To add holidays, we need **write permission**.

### Option A: Re-authorize with Write Scope (Recommended)

1. **Update the scope** in `src/lib/googleCalendarWrite.ts` (already done)
2. **Re-run OAuth**:
   ```
   http://localhost:3000/api/google/connect
   ```
3. Sign in again and grant the new permission

### Option B: Use the Existing Read-Only Setup

If you don't want to grant write permission, you can:
- Manually add holidays to Google Calendar (see Step 3)
- Or use the database fallback (holidays stored in MySQL)

---

## Step 2: Add Holidays via API (Automatic)

Once OAuth is set up with write permissions:

### Preview Holidays (No Changes)
```bash
# View 2025 holidays
http://localhost:3000/api/google/add-holidays?year=2025

# View 2026 holidays
http://localhost:3000/api/google/add-holidays?year=2026
```

### Add Holidays to Google Calendar
Use Postman, curl, or browser console:

```bash
# Using curl (PowerShell)
curl -X POST http://localhost:3000/api/google/add-holidays `
  -H "Content-Type: application/json" `
  -d '{"year": 2025}'

# Or using Invoke-RestMethod (PowerShell)
Invoke-RestMethod -Uri "http://localhost:3000/api/google/add-holidays" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"year": 2025}'
```

### Expected Response
```json
{
  "success": true,
  "message": "Successfully added 15 holidays, skipped 0 existing",
  "details": {
    "added": 15,
    "skipped": 0,
    "errors": []
  }
}
```

---

## Step 3: Manual Setup (Alternative)

If you prefer to add holidays manually:

### 2025 Sri Lankan Mercantile Holidays

1. **January 14** - Tamil Thai Pongal Day
2. **February 4** - Independence Day
3. **March 14** - Maha Sivarathri Day
4. **April 11** - Id-Ul-Fitr (Ramazan Festival Day)
5. **April 13** - Day prior to Sinhala & Tamil New Year Day
6. **April 14** - Sinhala & Tamil New Year Day
7. **April 18** - Good Friday
8. **May 1** - May Day
9. **May 12** - Vesak Full Moon Poya Day
10. **May 13** - Day following Vesak Full Moon Poya Day
11. **June 17** - Id-Ul-Alha (Hajj Festival Day)
12. **June 18** - Special Bank Holiday
13. **October 20** - Deepavali Festival Day
14. **October 29** - Milad-Un-Nabi (Holy Prophet's Birthday)
15. **December 25** - Christmas Day

### How to Add Manually
1. Open [Google Calendar](https://calendar.google.com)
2. Click **+ Create** → **Event**
3. Set as **All-day event**
4. Add to the calendar specified in your `.env.local` (`GOOGLE_CALENDAR_ID`)
5. Repeat for all holidays

---

## Step 4: Verify Holidays Appear

1. **Open booking page** in your app
2. **Navigate to a month** with holidays (e.g., January 2025)
3. **Check that holiday dates show**:
   - Blue background
   - Star icon (⭐)
   - Tooltip with holiday name
   - Cannot be selected

---

## 🔧 Troubleshooting

### "Insufficient permissions" error
- You need to re-authorize with write scope
- Visit: `http://localhost:3000/api/google/connect`
- Grant the new permissions

### Holidays not showing in booking calendar
1. Check connection: `http://localhost:3000/api/google/status`
2. Verify events in Google Calendar web UI
3. Restart dev server: `npm run dev`
4. Clear browser cache and reload

### Wrong calendar
- Check `.env.local` → `GOOGLE_CALENDAR_ID`
- Should point to the calendar where you added holidays
- Default is `primary` (your main calendar)

---

## 🎯 Quick Test Script

Create a test file to verify:

```typescript
// test-holidays.ts
import { bulkAddHolidays } from './src/lib/googleCalendarWrite'

const testHolidays = [
  { date: '2025-01-14', name: 'Tamil Thai Pongal Day' },
  { date: '2025-02-04', name: 'Independence Day' },
]

async function test() {
  const result = await bulkAddHolidays(testHolidays)
  console.log(result)
}

test()
```

Run: `npx tsx test-holidays.ts`

---

## 📊 What Happens After Adding

1. **Holidays appear in Google Calendar** (visible in calendar.google.com)
2. **Booking calendar auto-fetches** them via API
3. **Users see blue holiday markers** automatically
4. **No database changes needed** - everything syncs from Google

---

## ✨ Benefits of Google Calendar Approach

✅ **Centralized management** - Update holidays in one place  
✅ **Automatic sync** - Changes appear immediately  
✅ **Audit trail** - Google Calendar tracks who added what  
✅ **Shared access** - Multiple admins can manage  
✅ **No code changes** - Add holidays without deploying  

---

## 🔐 Security Note

The write scope allows creating/editing events in your calendar. To limit risk:
- Use a **dedicated calendar** for mercantile holidays only
- Set `GOOGLE_CALENDAR_ID` to that calendar's ID
- Don't use your personal calendar
- Consider creating a service account for production

---

## Next Steps

1. ✅ Re-authorize OAuth with write scope
2. ✅ Run POST to `/api/google/add-holidays` 
3. ✅ Verify holidays in Google Calendar
4. ✅ Check booking calendar shows blue markers
5. ✅ Test selecting dates (should be disabled for holidays)

Need help? Check the main `GOOGLE_CALENDAR_SETUP.md` for full documentation.
