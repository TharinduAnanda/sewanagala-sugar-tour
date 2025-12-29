# 🔧 ADMIN LOGIN 404 FIX - COMPLETE SOLUTION

## 🚨 Problem: POST http://localhost:5000/api/admin/login 404 (Not Found)

This means the backend server is running but the route isn't being found. Here's the complete fix:

---

## ✅ SOLUTION CHECKLIST

### Step 1: Stop and Clean Everything

```powershell
# Kill all Node processes
Get-Process node | Stop-Process -Force

# Wait 2 seconds
Start-Sleep -Seconds 2

# Verify all processes killed
Get-Process node -ErrorAction SilentlyContinue
# Should return: nothing
```

---

### Step 2: Verify All Backend Files Exist

Run this to verify files are in place:

```powershell
# Check key files exist
ls server/controllers/adminController.js
ls server/middleware/adminAuth.js
ls server/routes/adminRoutes.js
ls server/server.js
ls server/.env
```

All 5 files should exist! ✅

---

### Step 3: Verify Database Setup

```powershell
# Open MySQL command line
mysql -u root -p

# Run these commands:
USE sewanagala_tour;
SHOW TABLES;
# Should show: bookings table exists

SELECT COUNT(*) FROM bookings;
# Should return a number (0 or more)
```

If bookings table doesn't exist, run:

```sql
-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    booking_id VARCHAR(50) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    visitor_count INT NOT NULL,
    visit_date DATE NOT NULL,
    visit_time VARCHAR(10) NOT NULL,
    special_requirements TEXT,
    status ENUM('pending', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_bookings_phone ON bookings(phone);
CREATE INDEX idx_bookings_booking_id ON bookings(booking_id);
CREATE INDEX idx_bookings_status ON bookings(status);
```

---

### Step 4: Verify .env File is Correct

```powershell
# Check .env content
cat server\.env
```

Should contain:

```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=sewanagala_tour

# Admin Configuration
ADMIN_EMAIL=admin@sewanagala.com
ADMIN_PASSWORD_HASH=$2b$10$8qM4P0K7L9.J3X5Z1Q6W9uYkR2H8mV4pT5zD9cF3nL0w2X7b1s9A
JWT_SECRET=sewanagala_jwt_secret_key_2024_production

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

✅ If different, use the above exactly.

---

### Step 5: Fresh Backend Start

```powershell
# Navigate to server
cd server

# Install dependencies fresh
rm -r node_modules
npm install

# Start server with output
npm start

# You should see:
# 🚀 Server running on port 5000
# 🌍 Environment: development
# 📍 Health check: http://localhost:5000/api/health
```

**Don't proceed until you see these messages!**

---

### Step 6: Test Backend Health

In a **NEW** PowerShell terminal:

```powershell
# Test health endpoint
curl http://localhost:5000/api/health

# Should return:
# {"status":"OK","message":"Sewanagala Sugar Factory API is running","timestamp":"..."}
```

✅ If this works, backend is running correctly!

---

### Step 7: Test Admin Login Endpoint Directly

```powershell
# Test login endpoint
curl -X POST http://localhost:5000/api/admin/login `
  -H "Content-Type: application/json" `
  -d '{"email":"admin@sewanagala.com","password":"admin123"}'

# Should return:
# {"success":true,"message":"Login successful","token":"eyJh...","admin":{"email":"admin@sewanagala.com","role":"admin"}}
```

✅ If this works, backend is responding correctly!

---

### Step 8: Frontend Configuration

Verify `client/src/pages/AdminLogin.jsx` has correct API URL:

```javascript
const response = await fetch('http://localhost:5000/api/admin/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ email, password }),
});
```

✅ Should be exactly: `http://localhost:5000/api/admin/login`

---

### Step 9: Start Frontend

In a **NEW** PowerShell terminal:

```powershell
cd client
npm start

# Should show:
# Compiled successfully!
# You can now view sewanagala-sugar-tour in the browser...
```

✅ Browser should open automatically

---

### Step 10: Test Admin Login in Browser

1. Go to: `http://localhost:3000/admin/login`
2. Enter credentials:
   - Email: `admin@sewanagala.com`
   - Password: `admin123`
3. Click Login
4. ✅ Should redirect to dashboard!

---

## 🔍 Troubleshooting

### Still Getting 404?

**Check 1: Backend Server Actually Running?**
```powershell
# In browser, visit:
http://localhost:5000/api/health

# Should show JSON response
```

❌ If error, backend isn't running → Go back to Step 5

---

**Check 2: Port 5000 Already in Use?**
```powershell
# Find process using port 5000
Get-NetTCPConnection -LocalPort 5000

# Kill it
Get-Process node | Stop-Process -Force
```

Then restart backend from Step 5.

---

**Check 3: adminRoutes.js Being Loaded?**

Add this to `server/server.js` right after other routes (around line 27):

```javascript
// Add this console log to verify routes are loading
console.log('📍 Checking admin routes...');
app.use('/api/admin', require('./routes/adminRoutes'));
console.log('✅ Admin routes loaded successfully');
```

Restart backend and look for those console messages.

---

**Check 4: Verify adminController Functions Exist**

Open `server/controllers/adminController.js` and check:
```javascript
exports.adminLogin = async (req, res) => { ... }
exports.adminLogout = (req, res) => { ... }
exports.verifyToken = (req, res) => { ... }
// etc
```

All functions should be exported!

---

### Getting 400/401 Error (Not 404)?

This is GOOD! It means the route is found. The issue is credentials:

- 400 = Missing email/password
- 401 = Wrong credentials

**Fix:** Verify password hash in `.env`

```powershell
# Generate correct hash for "admin123"
node -e "require('bcryptjs').hash('admin123', 10, console.log)"
```

Copy the hash to `ADMIN_PASSWORD_HASH` in `.env`, restart backend.

---

## 📋 Complete Backend File Checklist

### ✅ server/server.js
```javascript
// MUST have this line (around line 27):
app.use('/api/admin', require('./routes/adminRoutes'));
```

### ✅ server/routes/adminRoutes.js
```javascript
// MUST have this route:
router.post('/login', adminController.adminLogin);
```

### ✅ server/controllers/adminController.js
```javascript
// MUST have this export:
exports.adminLogin = async (req, res) => { ... }
```

### ✅ server/middleware/adminAuth.js
```javascript
// MUST export middleware:
module.exports = authenticateAdmin;
```

### ✅ server/.env
```env
ADMIN_EMAIL=admin@sewanagala.com
ADMIN_PASSWORD_HASH=$2b$10$8qM4P0K7L9.J3X5Z1Q6W9uYkR2H8mV4pT5zD9cF3nL0w2X7b1s9A
JWT_SECRET=sewanagala_jwt_secret_key_2024_production
```

### ✅ server/package.json
```json
"dependencies": {
  "bcryptjs": "^3.0.3",
  "jsonwebtoken": "^9.0.2",
  ...
}
```

All must be present! ✅

---

## 🎯 Complete Fresh Setup (Nuclear Option)

If nothing above works:

```powershell
# 1. Kill everything
Get-Process node | Stop-Process -Force

# 2. Clean dependencies
cd server
rm -r node_modules
rm package-lock.json

# 3. Reinstall
npm install

# 4. Verify .env
cat .env
# Make sure ADMIN_PASSWORD_HASH is set correctly

# 5. Start fresh
npm start

# WAIT - you should see:
# 🚀 Server running on port 5000

# 6. In new terminal test
curl http://localhost:5000/api/health

# 7. In new terminal start frontend
cd client
npm start
```

---

## 📚 Complete Database Setup

If you need to rebuild the database from scratch:

```sql
-- Drop old database
DROP DATABASE IF EXISTS sewanagala_tour;

-- Create new database
CREATE DATABASE sewanagala_tour;
USE sewanagala_tour;

-- Create stations table
CREATE TABLE stations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    station_number INT UNIQUE NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    map_x INT,
    map_y INT,
    category ENUM('processing', 'machinery', 'storage', 'office', 'history') DEFAULT 'processing',
    duration_minutes INT DEFAULT 5,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create media table
CREATE TABLE media (
    id INT PRIMARY KEY AUTO_INCREMENT,
    station_id INT,
    media_type ENUM('image', 'video') NOT NULL,
    cloudinary_url VARCHAR(500) NOT NULL,
    cloudinary_public_id VARCHAR(255),
    title VARCHAR(255),
    description TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (station_id) REFERENCES stations(id) ON DELETE CASCADE
);

-- Create bookings table (MOST IMPORTANT FOR ADMIN)
CREATE TABLE bookings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    booking_id VARCHAR(50) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    visitor_count INT NOT NULL,
    visit_date DATE NOT NULL,
    visit_time VARCHAR(10) NOT NULL,
    special_requirements TEXT,
    status ENUM('pending', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_bookings_phone (phone),
    INDEX idx_bookings_booking_id (booking_id),
    INDEX idx_bookings_status (status),
    INDEX idx_bookings_date (visit_date)
);

-- Create tour_logs table
CREATE TABLE tour_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    visitor_id VARCHAR(100) NOT NULL,
    station_id INT,
    visited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    duration_seconds INT DEFAULT 0,
    FOREIGN KEY (station_id) REFERENCES stations(id) ON DELETE CASCADE,
    INDEX idx_tour_visitor (visitor_id),
    INDEX idx_tour_station (station_id)
);

-- Insert sample booking for testing
INSERT INTO bookings (booking_id, phone, name, email, visitor_count, visit_date, visit_time, status)
VALUES ('BOOKING001', '+94712345678', 'Test User', 'test@example.com', 4, '2024-12-15', '09:00 AM', 'pending');

-- Verify
SELECT COUNT(*) FROM bookings;
# Should return: 1
```

---

## ✅ Final Verification

After completing all steps, test the complete flow:

1. ✅ Backend running: `http://localhost:5000/api/health`
2. ✅ Login endpoint works: `POST http://localhost:5000/api/admin/login`
3. ✅ Frontend running: `http://localhost:3000`
4. ✅ Admin login page loads: `http://localhost:3000/admin/login`
5. ✅ Can login with credentials: admin@sewanagala.com / admin123
6. ✅ Redirects to dashboard: `http://localhost:3000/admin/dashboard`
7. ✅ Dashboard shows statistics

All should show ✅!

---

## 📞 Still Having Issues?

Check these files exist in your project:

```
d:\Sewanagala Projects\sewanagala-sugar-tour\
├── server/
│   ├── controllers/adminController.js ✅
│   ├── middleware/adminAuth.js ✅
│   ├── routes/adminRoutes.js ✅
│   ├── server.js ✅
│   ├── .env ✅
│   └── package.json ✅
│
├── client/
│   └── src/
│       └── pages/AdminLogin.jsx ✅
│
└── database/
    └── schema.sql ✅
```

If any are missing, the setup is incomplete!

---

**Version:** 1.0.0  
**Date:** 2024  
**Status:** Complete Fix Guide

---

**Follow these steps in order and your admin panel will work! 🚀**

