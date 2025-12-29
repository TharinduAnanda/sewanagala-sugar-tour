# Admin Panel Troubleshooting Guide

## 🚨 Common Issues & Solutions

---

## ❌ Login Issues

### Issue: "Invalid email or password" error
**Cause:** Wrong email or password entered

**Solutions:**
1. Verify you're using the exact credentials:
   - Email: `admin@sewanagala.com` (exact match)
   - Password: `admin123` (case-sensitive)
2. Check CAPS LOCK is off
3. Clear browser cache:
   - Open DevTools (F12)
   - Right-click Reload → "Empty cache and hard refresh"
4. Try in an Incognito/Private window

**If still not working:**
- Check .env file has correct password hash
- Generate new hash: `bcryptjs.hash('admin123', 10)`
- Update `.env` with new hash

---

### Issue: Login button doesn't respond
**Cause:** Form validation error or network issue

**Solutions:**
1. Check DevTools console (F12) for errors
2. Verify email field is not empty
3. Verify password field is not empty
4. Check backend is running: http://localhost:5000/api/health
5. Try submitting form again
6. Hard refresh page (Ctrl+F5)

**If still not working:**
- Kill and restart backend server
- Kill and restart frontend server

---

### Issue: "Network error" when logging in
**Cause:** Backend not running or CORS issue

**Solutions:**
1. Verify backend is running:
   ```powershell
   cd server
   npm start
   ```
2. Check backend is on port 5000 (not another port)
3. In DevTools Network tab, check POST to http://localhost:5000/api/admin/login
4. If CORS error: restart backend with:
   ```powershell
   npm start
   ```

---

### Issue: Can't login, stays on login page
**Cause:** Invalid credentials or token storage issue

**Solutions:**
1. Clear localStorage:
   ```javascript
   // Open DevTools console (F12) and run:
   localStorage.clear();
   ```
2. Close browser tab completely, reopen
3. Try in Incognito window
4. Check browser's site data isn't corrupted:
   - Settings → Privacy → Clear browsing data → localStorage

---

---

## ❌ Access Issues

### Issue: Redirected to login from dashboard
**Cause:** Token expired or missing

**Solutions:**
1. Login again - tokens expire after 24 hours
2. Check token in localStorage:
   ```javascript
   // DevTools console:
   localStorage.getItem('adminToken')
   ```
3. If empty, token was lost:
   - Check if cookies are allowed
   - Check if localStorage is enabled
4. Try this:
   ```javascript
   // Enable localStorage if blocked:
   localStorage.setItem('test', 'test');
   console.log(localStorage.getItem('test'));
   ```

---

### Issue: "Unauthorized" error on dashboard
**Cause:** Invalid or expired token

**Solutions:**
1. Logout and login again:
   - Click logout button
   - Login with credentials
2. Clear stored token:
   ```javascript
   localStorage.removeItem('adminToken');
   ```
3. Manually navigate to /admin/login

---

### Issue: Can't access /admin/bookings
**Cause:** ProtectedRoute blocking access without token

**Solutions:**
1. Ensure you're logged in first
2. Check token exists:
   ```javascript
   // DevTools console:
   localStorage.getItem('adminToken') !== null
   ```
3. If false, login first
4. Try accessing /admin/dashboard first
5. Then try /admin/bookings

---

### Issue: Blank page on /admin/dashboard
**Cause:** Component error or failed data fetch

**Solutions:**
1. Check DevTools console (F12) for errors
2. Check Network tab for failed requests
3. Verify backend /api/admin/dashboard endpoint works:
   ```powershell
   # Terminal:
   curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:5000/api/admin/dashboard
   ```
4. Hard refresh: Ctrl+F5
5. Close tab and reopen
6. Check server logs for errors

---

---

## ❌ Booking Management Issues

### Issue: No bookings display in table
**Cause:** No bookings in database or filter too restrictive

**Solutions:**
1. Verify bookings exist in database:
   ```sql
   SELECT * FROM bookings;
   ```
2. Click "Reset Filters" button to clear filters
3. Check if all bookings are cancelled
4. Try different status filter
5. Clear search box
6. Check date range

---

### Issue: Search doesn't work
**Cause:** Search term not matching database

**Solutions:**
1. Type exactly as name appears in database
2. Clear search box and try again
3. Use partial matches (e.g., "john" not "John Doe")
4. Check exact email/phone in database
5. Open DevTools Network tab to see search request

---

### Issue: Filter not working
**Cause:** Filter not applied correctly

**Solutions:**
1. Click filter dropdown
2. Select option
3. Wait 1-2 seconds for results
4. Scroll down to see filtered results
5. Try resetting all filters
6. Refresh page (F5)

---

### Issue: Approve/Reject buttons disabled
**Cause:** Button is only enabled for pending bookings

**Solutions:**
1. Scroll right to find the booking's status
2. Filter by "pending" to see approvable bookings
3. Only pending bookings have approve/reject buttons
4. Confirmed bookings have reschedule button

---

### Issue: Approve/Reject doesn't work
**Cause:** Modal not showing or API error

**Solutions:**
1. Check DevTools console for errors
2. Click button again
3. Check Network tab for failed request
4. Verify token is valid:
   ```javascript
   // DevTools:
   localStorage.getItem('adminToken')
   ```
5. Try logging out and back in
6. Refresh page and try again

---

### Issue: Reschedule modal doesn't open
**Cause:** Component error or button not triggering

**Solutions:**
1. Click on approved booking's row first
2. Make sure status is "confirmed" (green badge)
3. Look for "Reschedule" button in actions
4. Click reschedule button
5. Check DevTools console for errors

---

### Issue: Can't select date in reschedule modal
**Cause:** Date picker not initialized

**Solutions:**
1. Click on date input field
2. Calendar picker should appear
3. If not, try clicking again
4. Try typing date directly: YYYY-MM-DD
5. Close and reopen modal
6. Refresh page

---

### Issue: Changes don't save
**Cause:** API request failed

**Solutions:**
1. Check DevTools Network tab for failed requests
2. Check server logs for errors
3. Verify backend is running
4. Try action again
5. Check if you have permission (token valid)
6. Hard refresh page (Ctrl+F5)

---

---

## ❌ Backend Issues

### Issue: Backend won't start
**Cause:** Port in use or missing dependencies

**Solutions:**
```powershell
# Stop any existing processes on port 5000:
Get-NetTCPConnection -LocalPort 5000 | Stop-Process -Force

# Install dependencies:
cd server
npm install

# Start server:
npm start
```

---

### Issue: "Cannot find module" error
**Cause:** Missing npm package

**Solutions:**
```powershell
cd server
npm install
# This will install missing packages from package.json
```

---

### Issue: Database connection error
**Cause:** MySQL not running or wrong credentials

**Solutions:**
1. Verify MySQL is running
2. Check .env has correct credentials:
   - DB_HOST=localhost
   - DB_USER=root
   - DB_PASSWORD=
   - DB_NAME=sewanagala_tour
3. Test connection:
   ```powershell
   mysql -h localhost -u root -D sewanagala_tour
   ```
4. Run database schema:
   ```powershell
   mysql -h localhost -u root -D sewanagala_tour < ../database/schema.sql
   ```

---

### Issue: JWT_SECRET not working
**Cause:** Environment variable not loaded

**Solutions:**
1. Check .env file exists in server directory
2. Check JWT_SECRET is set in .env
3. Restart server after editing .env:
   ```powershell
   npm start
   ```
4. Verify .env is not in .gitignore (it shouldn't be for local dev)

---

---

## ❌ Frontend Issues

### Issue: Frontend won't start
**Cause:** Port 3000 in use or build error

**Solutions:**
```powershell
# Kill port 3000:
Get-NetTCPConnection -LocalPort 3000 | Stop-Process -Force

# Clear cache:
cd client
rm -r node_modules
rm package-lock.json

# Reinstall:
npm install

# Start:
npm start
```

---

### Issue: Blank white page
**Cause:** React compilation error

**Solutions:**
1. Check terminal for errors
2. Check browser console (F12) for errors
3. Look for red lines in terminal
4. Stop server (Ctrl+C)
5. Clear node_modules:
   ```powershell
   rm -r node_modules
   npm install
   npm start
   ```

---

### Issue: "Cannot find page" error
**Cause:** Route not configured or wrong URL

**Solutions:**
1. Check URL is exactly: http://localhost:3000/admin/login
2. Verify App.js has route configured
3. Check ProtectedRoute component exists
4. Refresh page (F5)

---

### Issue: CSS not loading
**Cause:** CSS file missing or import error

**Solutions:**
1. Check CSS file exists in src/styles/
2. Check import in component:
   ```javascript
   import '../styles/AdminLogin.css';
   ```
3. Check file name exactly matches
4. Hard refresh (Ctrl+F5)
5. Clear browser cache

---

---

## ❌ CORS Issues

### Issue: "CORS policy blocked request"
**Cause:** Backend CORS settings

**Solutions:**
1. Check server.js has:
   ```javascript
   app.use(cors());
   ```
2. Verify backend is running
3. Check frontend URL is in CORS allowed origins
4. Restart backend server

---

### Issue: Preflight request fails
**Cause:** OPTIONS request not allowed

**Solutions:**
1. Ensure CORS is enabled in server.js
2. Check backend is running
3. Try simple GET request first in browser:
   ```javascript
   fetch('http://localhost:5000/api/health')
   ```
4. If that works, CORS is probably fine

---

---

## ❌ Data Issues

### Issue: Wrong data showing in dashboard
**Cause:** Stale cache or DB not updated

**Solutions:**
1. Hard refresh page (Ctrl+F5)
2. Verify database has correct data:
   ```sql
   SELECT COUNT(*) as total FROM bookings;
   SELECT COUNT(*) FROM bookings WHERE status='pending';
   ```
3. Check if useEffect is running:
   - Open DevTools console
   - Add console.log to verify function runs
4. Clear browser cache completely

---

### Issue: Stats don't match actual bookings
**Cause:** Dashboard query not accurate

**Solutions:**
1. Manually count in database:
   ```sql
   SELECT status, COUNT(*) FROM bookings GROUP BY status;
   ```
2. Compare with dashboard stats
3. Refresh dashboard (F5)
4. Check for timezone differences:
   - Today's visits might be filtering wrong timezone
5. Check database time zone matches server

---

---

## 🛠️ Debugging Tips

### Enable Detailed Logging

**Backend:**
```javascript
// Add to adminController.js
console.log('Booking ID:', bookingId);
console.log('Request body:', req.body);
console.log('Auth header:', req.headers.authorization);
```

**Frontend:**
```javascript
// Add to AdminDashboard.jsx
console.log('Fetching dashboard stats...');
console.log('Token:', localStorage.getItem('adminToken'));
console.log('Response:', data);
```

---

### Check Network Requests

1. Open DevTools (F12)
2. Go to Network tab
3. Perform an action
4. Look for failed requests (red)
5. Click request to see:
   - Request headers (Authorization)
   - Response status
   - Response body (error message)

---

### Check Browser Storage

```javascript
// DevTools console:
// See all localStorage items
Object.keys(localStorage).forEach(key => {
  console.log(key + ': ' + localStorage.getItem(key));
});

// Check specific token
console.log(localStorage.getItem('adminToken'));

// Check email
console.log(localStorage.getItem('adminEmail'));
```

---

### Test API Directly

```powershell
# Test login
curl -X POST http://localhost:5000/api/admin/login `
  -H "Content-Type: application/json" `
  -d '{\"email\":\"admin@sewanagala.com\",\"password\":\"admin123\"}'

# Test dashboard (replace TOKEN with actual token)
curl -H "Authorization: Bearer TOKEN" `
  http://localhost:5000/api/admin/dashboard

# Test bookings
curl -H "Authorization: Bearer TOKEN" `
  http://localhost:5000/api/admin/bookings
```

---

## 📋 Support Information

**Before contacting support, gather:**
1. Error message (exact text)
2. What you were doing when error occurred
3. Browser type and version
4. Operating system
5. Screenshots of error
6. Console error messages (F12)
7. Network request details (DevTools Network tab)

---

## 🔍 Emergency Debugging

If nothing works:

1. **Complete Reset:**
   ```powershell
   # Stop servers
   # Clear browser cache (Ctrl+Shift+Del)
   # Clear localStorage (DevTools console):
   localStorage.clear()
   # Delete node_modules and reinstall:
   rm -r server/node_modules
   rm -r client/node_modules
   npm install (in both directories)
   # Restart both servers
   ```

2. **Check All Environment Variables:**
   ```powershell
   # View .env file:
   cat server/.env
   
   # Verify each line is correct:
   # - ADMIN_EMAIL set
   # - ADMIN_PASSWORD_HASH set
   # - JWT_SECRET set
   # - DB credentials correct
   ```

3. **Verify Database:**
   ```sql
   USE sewanagala_tour;
   SHOW TABLES;
   SELECT * FROM bookings LIMIT 1;
   ```

4. **Check Port Availability:**
   ```powershell
   # Port 3000 (frontend)
   Get-NetTCPConnection -LocalPort 3000
   
   # Port 5000 (backend)
   Get-NetTCPConnection -LocalPort 5000
   ```

5. **Nuclear Option - Fresh Install:**
   ```powershell
   # Backup current work
   # Delete node_modules in both folders
   # Run: npm install in both
   # Check .env file again
   # Restart servers
   ```

---

## 📞 Getting Help

1. Check this troubleshooting guide
2. Check ADMIN_SETUP.md for setup instructions
3. Check browser console for error messages
4. Check server terminal for error messages
5. Ask in team chat with:
   - Error message
   - Steps to reproduce
   - What you've already tried

---

**Last Updated:** 2024  
**Version:** 1.0.0

---

## Related Documentation

- 📖 [ADMIN_SETUP.md](./ADMIN_SETUP.md) - Detailed setup guide
- 📋 [ADMIN_QUICK_START.md](./ADMIN_QUICK_START.md) - Quick reference
- 🏗️ [ADMIN_ARCHITECTURE.md](./ADMIN_ARCHITECTURE.md) - System design
- ✅ [ADMIN_TESTING_CHECKLIST.md](./ADMIN_TESTING_CHECKLIST.md) - Testing guide

