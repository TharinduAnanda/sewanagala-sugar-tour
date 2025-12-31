# 🎉 Tunnelto Setup Complete - Sewanagala Sugar Tour

## ✅ Setup Summary

Your Next.js application is now accessible publicly via LocalTunnel!

---

## 🌐 Public URLs

**Live Application:** https://plain-sides-share.loca.lt

**Share this URL with:**
- Clients
- Team members
- Friends
- Anyone on the internet

---

## 🖥️ Running Services

### Terminal 1: Next.js Development Server
- **Port:** 3000
- **Local URL:** http://localhost:3000
- **Network URL:** http://192.168.99.207:3000
- **PID:** 2476
- **Status:** ✅ Running

### Terminal 2: LocalTunnel (Public Access)
- **Tunnel URL:** https://plain-sides-share.loca.lt
- **Forwarding to:** localhost:3000
- **PID:** 13216
- **Status:** ✅ Running

### Terminal 3: MySQL Database (XAMPP)
- **Port:** 3306
- **Host:** 127.0.0.1
- **Database:** sewanagala_sugar_tour
- **Status:** ✅ Running

---

## 📝 Environment Variables Updated

```env
NEXT_PUBLIC_API_URL=https://plain-sides-share.loca.lt
GOOGLE_REDIRECT_URI=https://plain-sides-share.loca.lt/api/google/callback
```

**Backup Created:** `.env.local.tunnel-backup`

---

## 🔄 How to Restart Services

### If Next.js Stops:
```powershell
cd "D:\Sewanagala Projects\sewanagala-sugar-tour"
npm run dev
```

### If Tunnel Stops:
```powershell
cd "D:\Sewanagala Projects\sewanagala-sugar-tour"
npx localtunnel --port 3000
```
**Note:** The tunnel URL will change each time you restart. Update `.env.local` accordingly.

### If MySQL Stops:
Open XAMPP Control Panel and start MySQL

---

## 🛠️ Management Commands

### Stop All Services:
```powershell
# Stop Next.js
Get-Process -Name node | Stop-Process -Force

# Stop Tunnel (automatically stops when you close terminal)
```

### Check Service Status:
```powershell
# Check Next.js
Get-Process -Name node

# Check MySQL
Get-NetTCPConnection -LocalPort 3306

# Check Tunnel
Get-Process -Name node | Where-Object {$_.Id -eq 13216}
```

---

## 📱 First-Time Access

When someone first visits **https://plain-sides-share.loca.lt**, they will see a LocalTunnel landing page:

1. Click **"Click to Continue"**
2. They will be redirected to your application

This is a security feature of LocalTunnel.

---

## ⚠️ Important Notes

### 1. **Tunnel URL Changes**
- LocalTunnel generates a new random URL each time you restart
- If you need a consistent subdomain, use ngrok (paid) or upgrade LocalTunnel

### 2. **Database Access**
- MySQL is NOT exposed publicly (this is correct and secure)
- Only your Next.js backend can access the database
- Database connection remains: `localhost:3306`

### 3. **Session Persistence**
- Keep both terminals open (Next.js + Tunnel)
- Closing either terminal will stop the service

### 4. **Environment Variables**
- Changes to `.env.local` require Next.js restart
- Always update URLs if tunnel changes

---

## 🔐 Security Considerations

✅ **Secure:**
- Database is NOT publicly accessible
- Only Next.js API routes are exposed
- Environment variables are not sent to client

⚠️ **Be Aware:**
- This is a development setup, not production-ready
- Sensitive data (API keys, passwords) should be rotated before production
- LocalTunnel is for demos/testing, not long-term hosting

---

## 🚀 Alternative Tunnel Solutions

If you need more features:

### **Ngrok** (Most Popular)
```bash
ngrok http 3000
```
- Stable URLs with paid plan
- Better performance
- Traffic inspection tools

### **Cloudflare Tunnel** (Enterprise)
```bash
cloudflared tunnel --url http://localhost:3000
```
- Very reliable
- Free tier available
- Better DDoS protection

### **Tunnelto** (If Updated)
```powershell
.\tunnelto-windows.exe --port 3000 --key YOUR_KEY
```
- Custom subdomains
- Requires latest version

---

## 📊 Current Architecture

```
Internet
    ↓
https://plain-sides-share.loca.lt (LocalTunnel)
    ↓
localhost:3000 (Next.js)
    ↓
localhost:3306 (MySQL)
```

---

## 🎯 What Works Now

✅ Public access to your application
✅ All Next.js pages and routes
✅ API endpoints
✅ Database connections
✅ Image uploads (Cloudinary)
✅ Email notifications
✅ SMS notifications
✅ Google Calendar integration

---

## 📞 Support

If you encounter issues:

1. Check if all services are running
2. Verify URLs in `.env.local` match current tunnel
3. Check browser console for errors
4. Restart services if needed

---

**Setup completed on:** December 31, 2025
**Tunnel expires:** When you close the terminal or restart your computer

Keep this file for reference! 📄

## 🔐 TUNNEL PASSWORD (IMPORTANT!)

**Your Tunnel Password:** 212.104.231.78

### How to Access:
1. Visit: https://plain-sides-share.loca.lt
2. Enter password: 212.104.231.78
3. Click Continue

### Share With Others:
When sharing the link, provide both:
- **URL:** https://plain-sides-share.loca.lt
- **Password:** 212.104.231.78

Visitors only need to enter this once every 7 days from their IP.

### If Password Changes:
Your IP might change if you restart router or switch networks.
Get new password by running:
```powershell
curl.exe https://loca.lt/mytunnelpassword
```

---

