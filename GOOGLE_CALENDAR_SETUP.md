# Google Calendar Integration - Setup Guide

## ✅ What's Been Implemented

This Next.js app now integrates with Google Calendar to automatically sync **mercantile holidays** and display them on both:
- **Public Booking Calendar** - Users see holidays marked with blue tint + star icon
- **Admin Calendar** - Admins see holidays and can manage factory closures

### Architecture
- **Google Calendar** → Mercantile holidays (read-only via OAuth)
- **MySQL Database** → Admin-managed factory closures
- **Next.js API Routes** → Merge both sources and serve to React components
- **Auto-close weekends** → Saturday and Sunday are always closed

---

## 🚀 Setup Instructions

### 1. Install Dependencies
```bash
cd "D:\Sewanagala Projects\sewanagala-sugar-tour"
npm install googleapis --legacy-peer-deps
```

### 2. Configure Environment Variables
The `.env.local` file has been updated with Google OAuth credentials:

```env
# Google Calendar OAuth (for Mercantile Holidays)
GOOGLE_CLIENT_ID=654025756080-p8gkdm9l16sigg3hsov6abr8ti66v8p2.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
GOOGLE_REDIRECT_URI=http://localhost:3000/api/google/callback
GOOGLE_CALENDAR_ID=primary
```

⚠️ **IMPORTANT SECURITY NOTE:**
The `GOOGLE_CLIENT_SECRET` you provided has been exposed publicly. You **MUST** regenerate it:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to APIs & Services > Credentials
3. Find your OAuth 2.0 Client ID
4. Click "Reset Secret" or create a new credential
5. Update `.env.local` with the new secret
6. Never commit `.env.local` to version control

### 3. Set Calendar ID
Currently set to `primary` (your main Google Calendar). For better organization:

**Option A: Use a dedicated calendar (Recommended)**
1. Create a new Google Calendar named "Mercantile Holidays"
2. Add all mercantile holidays to this calendar
3. Get the Calendar ID:
   - Calendar Settings → Integrate calendar → Calendar ID
   - Example: `abc123@group.calendar.google.com`
4. Update `.env.local`:
   ```env
   GOOGLE_CALENDAR_ID=abc123@group.calendar.google.com
   ```

**Option B: Use existing calendar**
- Keep `GOOGLE_CALENDAR_ID=primary`
- All events will be treated as holidays

### 4. Start the Development Server
```bash
npm run dev
```

### 5. Connect Google Calendar (One-Time Setup)
1. Open your browser and navigate to:
   ```
   http://localhost:3000/api/google/connect
   ```
2. You'll be redirected to Google's consent screen
3. Sign in with the Google account that owns the mercantile holidays calendar
4. Grant "View your calendars" permission
5. You'll see a success page: "Google Calendar Connected!"
6. The OAuth tokens are now stored securely in your MySQL database

### 6. Verify Connection
Check if connected:
```
http://localhost:3000/api/google/status
```

You should see:
```json
{
  "success": true,
  "connected": true,
  "message": "Google Calendar is connected"
}
```

---

## 📁 Files Created/Modified

### Backend (Next.js API)
- `src/lib/googleTokenStore.ts` - Manages OAuth tokens in MySQL
- `src/lib/googleCalendar.ts` - Google Calendar API client
- `src/app/api/google/connect/route.ts` - Initiates OAuth flow
- `src/app/api/google/callback/route.ts` - Handles OAuth callback
- `src/app/api/google/status/route.ts` - Check connection status
- `src/app/api/calendar/overview/public/route.ts` - Public calendar (booking page)
- `src/app/api/calendar/overview/route.ts` - Admin calendar with bookings
- `src/app/api/calendar/closures/route.ts` - CRUD for factory closures
- `src/app/api/calendar/closures/[id]/route.ts` - Update/delete closures

### Frontend (Already Working)
- `src/components/BookingCalendar.tsx` - Already styled for holidays vs closures
- Admin calendar page - Already consumes the API

### Database
- New table: `google_tokens` (auto-created on first use)
  - Stores OAuth access/refresh tokens
  - Auto-refreshes expired tokens

---

## 🎨 How It Looks

### Public Booking Calendar
- **Holiday (Google Calendar)**: Blue background, star icon, tooltip shows reason
- **Factory Closed (Admin DB)**: Red background, lock icon, tooltip shows reason
- **Weekend**: Auto-closed (grayed out)
- **Available**: Normal styling, clickable

### Admin Calendar
- Same visual distinction as public calendar
- Shows booking counts on available days
- Admins can add/delete factory closures (stored in DB)
- Holidays are read-only from Google Calendar

---

## 🔧 Usage

### For Admins
1. **Add Factory Closure**:
   - Go to Admin Calendar page
   - Click "Mark Factory Closure"
   - Select date, enter reason, choose type
   - This is stored in MySQL `factory_closures` table

2. **Manage Mercantile Holidays**:
   - Add/edit holidays directly in your Google Calendar
   - They'll automatically appear on the booking calendar
   - No need to manually add them to the database

### For Users
- Visit the booking page
- Calendar automatically shows:
  - Blue days = Mercantile holidays
  - Red days = Factory closed
  - Grayed = Weekends
- Cannot select closed/holiday dates

---

## 🐛 Troubleshooting

### "Google Calendar not connected" error
- Run: `http://localhost:3000/api/google/connect`
- Complete the OAuth flow

### No holidays showing
1. Check connection: `http://localhost:3000/api/google/status`
2. Verify your calendar has events for the month you're viewing
3. Check `.env.local` has correct `GOOGLE_CALENDAR_ID`
4. Restart dev server after changing `.env.local`

### OAuth errors
- Verify Google Cloud Console settings:
  - OAuth consent screen is published
  - Redirect URI matches: `http://localhost:3000/api/google/callback`
  - APIs enabled: Google Calendar API

---

## 🔐 Security Best Practices

1. **Regenerate Client Secret** immediately (as shown in setup step 2)
2. **Never commit** `.env.local` to Git (already in `.gitignore`)
3. **Use least-privilege scope**: `calendar.readonly` (already set)
4. **Rotate tokens** periodically (auto-handled by googleapis library)
5. **For production**:
   - Use environment-specific OAuth credentials
   - Set `GOOGLE_REDIRECT_URI` to your production domain
   - Consider service accounts if calendar is shared

---

## 📊 API Endpoints Reference

### Public (No Auth)
- `GET /api/calendar/overview/public?year=2024&month=12` - Month view for booking
- `GET /api/google/status` - Check if Google Calendar is connected

### OAuth Flow
- `GET /api/google/connect` - Start OAuth (redirects to Google)
- `GET /api/google/callback?code=...` - Handle OAuth callback (automatic)

### Admin (Auth Required - implement middleware if needed)
- `GET /api/calendar/overview?year=2024&month=12` - Month view with bookings
- `GET /api/calendar/closures?year=2024&month=12` - List factory closures
- `POST /api/calendar/closures` - Add factory closure
- `PUT /api/calendar/closures/[id]` - Update closure
- `DELETE /api/calendar/closures/[id]` - Delete closure

---

## 🎯 Next Steps

1. **Complete OAuth setup** (steps 2-6 above)
2. **Add holidays to Google Calendar** for testing
3. **Test booking calendar** - verify holidays show in blue
4. **Test admin calendar** - verify you can add/delete closures
5. **Set production redirect URI** when deploying

---

## 📞 Support

If you encounter issues:
1. Check dev console for errors: `npm run dev`
2. Verify database connection: MySQL should be running (XAMPP)
3. Check OAuth logs in browser console
4. Ensure all environment variables are set correctly

---

## ✨ Features Delivered

✅ Google Calendar OAuth integration  
✅ Automatic mercantile holiday sync  
✅ Visual distinction (blue holidays, red closures)  
✅ MySQL-backed factory closures  
✅ Weekend auto-closure  
✅ Token auto-refresh  
✅ Public + Admin calendar APIs  
✅ Existing React components already wired  

**No changes needed to your React components** - they already consume the correct API endpoints and render the styles!
