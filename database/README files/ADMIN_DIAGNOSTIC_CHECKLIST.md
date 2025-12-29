# 🔍 Admin Login 404 - Diagnostic Checklist

## Quick Diagnostic (Run These Commands)

### 1. Verify Backend is Running
```powershell
# Check if Node is running on port 5000
netstat -ano | findstr :5000

# Or use:
Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue
```

**Expected:** Should show a process listening on port 5000  
**If not:** Backend isn't running → Start it: `cd server && npm start`

---

### 2. Test Backend Health Endpoint
```powershell
curl http://localhost:5000/api/health
```

**Expected Response:**
```json
{"status":"OK","message":"Sewanagala Sugar Factory API is running","timestamp":"2024-..."}
```

**If 404:** Backend routes aren't loading  
**If error:** Backend crashed  

---

### 3. Verify Admin Routes File Exists
```powershell
ls server/routes/adminRoutes.js
```

**Should exist:** `server/routes/adminRoutes.js`  
**If not found:** File is missing!

---

### 4. Verify Admin Controller Exists
```powershell
ls server/controllers/adminController.js
```

**Should exist:** `server/controllers/adminController.js`  
**If not found:** File is missing!

---

### 5. Check server.js Has Admin Route
```powershell
# Search for admin route registration
Select-String "app.use('/api/admin'" server/server.js
```

**Should show:** `app.use('/api/admin', require('./routes/adminRoutes'));`  
**If not found:** Route isn't registered!

---

### 6. Test Admin Login Endpoint Directly
```powershell
curl -X POST http://localhost:5000/api/admin/login `
  -H "Content-Type: application/json" `
  -d '{"email":"admin@sewanagala.com","password":"admin123"}'
```

**Expected Response:**
```json
{"success":true,"message":"Login successful","token":"eyJ...","admin":{"email":"admin@sewanagala.com","role":"admin"}}
```

**If 404:** Route doesn't exist  
**If 401:** Wrong credentials  
**If 400:** Missing email/password  

---

## 🛠️ Common Issues & Quick Fixes

### Issue: Backend Returns 404 for Admin Login

**Fix 1: Restart Backend**
```powershell
Get-Process node | Stop-Process -Force
cd server
npm start
```

**Fix 2: Reinstall Dependencies**
```powershell
cd server
rm -r node_modules
npm install
npm start
```

**Fix 3: Check Route Registration**
Edit `server/server.js` - make sure line 27 has:
```javascript
app.use('/api/admin', require('./routes/adminRoutes'));
```

---

### Issue: Backend Crashes on Start

**Symptoms:** 
```
Error: Cannot find module
```

**Fix:** Reinstall all packages
```powershell
cd server
npm install bcryptjs jsonwebtoken express cors dotenv
npm start
```

---

### Issue: 401 Unauthorized

**Means:** Route found but credentials wrong

**Fix:** Verify .env file
```powershell
cat server\.env

# Should contain:
# ADMIN_EMAIL=admin@sewanagala.com
# ADMIN_PASSWORD_HASH=$2b$10$8qM4P0K7L9.J3X5Z1Q6W9uYkR2H8mV4pT5zD9cF3nL0w2X7b1s9A
```

---

### Issue: Port 5000 Already in Use

**Fix:**
```powershell
# Find process
Get-NetTCPConnection -LocalPort 5000

# Kill it
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process -Force

# Start backend
cd server
npm start
```

---

## 📋 Complete Diagnostics Output Template

When everything works, you should see:

```
BACKEND STATUS:
✅ Backend running on port 5000
✅ Health endpoint returns 200
✅ Admin routes file exists
✅ Admin controller file exists
✅ Route registered in server.js
✅ Admin login endpoint responds with token
✅ Database connection working

FRONTEND STATUS:
✅ Frontend running on port 3000
✅ Admin login page loads
✅ Login form submits to correct endpoint
✅ Redirects to dashboard on success

OVERALL:
✅ ALL SYSTEMS OPERATIONAL
✅ Ready to manage bookings!
```

---

## 🚨 Emergency Reset

If nothing works, do a complete reset:

```powershell
# 1. Kill all Node processes
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force

# 2. Wait
Start-Sleep -Seconds 2

# 3. Clean server
cd server
rm -r node_modules
rm package-lock.json

# 4. Reinstall
npm install

# 5. Verify .env exists
ls .env

# 6. Start
npm start

# 7. In another terminal, test
curl http://localhost:5000/api/health

# 8. If health check passes, start frontend
cd client
npm start
```

---

## 📊 Verification Results

After running diagnostics, note:

- Backend running? [ ] Yes [ ] No
- Health check passes? [ ] Yes [ ] No
- Admin routes exist? [ ] Yes [ ] No
- Frontend running? [ ] Yes [ ] No
- Login endpoint responds? [ ] Yes [ ] No
- Can login successfully? [ ] Yes [ ] No
- Dashboard displays? [ ] Yes [ ] No

**If all checked:** ✅ System is working!  
**If any unchecked:** See fixes above for that specific issue

---

## 🎯 Next Steps After 404 Fix

1. ✅ Login endpoint working
2. ✅ Login with credentials
3. ✅ View dashboard
4. ✅ Manage bookings
5. ✅ Approve/reject/reschedule
6. ✅ Export to CSV

**All should work smoothly!**

