# 📧 How to Test and Fix Email Service

## Current Situation

Your application is live at: **https://sewanagala-sugar-tour-production.up.railway.app/**

✅ Site is accessible and working
❌ Email service needs environment variables configured

## The Problem

The email service is not working because Railway doesn't have access to your local `.env.local` file. You need to manually add the email configuration to Railway's environment variables.

## 🚀 Quick Fix (Follow These Steps)

### Step 1: Access Railway Dashboard

1. Open your browser and go to: **https://railway.app/**
2. Log in to your account
3. Find and click on your project: **sewanagala-sugar-tour-production**

### Step 2: Add Email Environment Variables

1. In your Railway project, click on your **service/deployment**
2. Click on the **"Variables"** tab
3. Click **"New Variable"** or **"RAW Editor"** (easier)
4. Add these 4 variables:

```plaintext
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tharindulalanath49@gmail.com
EMAIL_APP_PASSWORD=pekn uqhy kklc ltjh
```

5. Click **"Add"** or **"Save"** for each variable

### Step 3: Important - Gmail Security

⚠️ **The current password may not work from Railway servers!**

Gmail blocks connections from cloud servers for security. You MUST use an **App-Specific Password**:

#### How to Generate Gmail App Password:

1. Go to: **https://myaccount.google.com/security**
2. Make sure **2-Step Verification is enabled** (if not, enable it)
3. Search for **"App passwords"** in the search bar
4. Click on **"App passwords"**
5. Select:
   - App: **Mail**
   - Device: **Other (Custom name)** → Type: "Railway Sewanagala"
6. Click **Generate**
7. Copy the **16-character password** (without spaces)
8. Go back to Railway Variables
9. **Update** `EMAIL_APP_PASSWORD` with this new password

### Step 4: Wait for Redeploy

After adding/updating variables:
- Railway will **automatically redeploy** your application
- Wait 2-3 minutes for deployment to complete
- Check the **"Deployments"** tab to see progress

### Step 5: Test Email Service

#### Method 1: Using the Web Interface (Easiest)

1. Open in browser: **https://sewanagala-sugar-tour-production.up.railway.app/test-email**
2. You'll see a test page with a button
3. Click **"Send Test Email"**
4. Wait for the result
5. Check your email inbox (and spam folder)

#### Method 2: Direct API Test

Open this URL in your browser:
```
https://sewanagala-sugar-tour-production.up.railway.app/api/test-email-send
```

You should see a JSON response like:
```json
{
  "success": true,
  "message": "Test email sent successfully!"
}
```

Or if it fails:
```json
{
  "success": false,
  "error": "Email server connection failed",
  "details": { ... }
}
```

### Step 6: Test with Real Booking

1. Go to: **https://sewanagala-sugar-tour-production.up.railway.app/booking**
2. Fill in the booking form
3. Submit the booking
4. Check if you receive the confirmation email

## 📊 Checking if Variables are Set

### In Railway Dashboard:

1. Go to your project
2. Click **"Variables"** tab
3. You should see these variables listed:

| Variable Name | Status |
|--------------|--------|
| `EMAIL_HOST` | ✅ Should be: smtp.gmail.com |
| `EMAIL_PORT` | ✅ Should be: 587 |
| `EMAIL_USER` | ✅ Should be: your email |
| `EMAIL_APP_PASSWORD` | ✅ Should be: 16-character app password |

### Check Railway Logs:

1. Go to **"Deployments"** tab
2. Click on the latest deployment
3. View **"Logs"**
4. Look for messages like:
   - ✅ `"Email transporter created successfully"`
   - ❌ `"Email service not configured"`
   - ❌ `"Email server connection failed"`

## 🔍 Troubleshooting

### Issue: "Email service not configured"

**Cause:** Environment variables not set in Railway

**Fix:**
- Double-check you added all 4 EMAIL_* variables
- Variables are case-sensitive (must be exactly as shown)
- Redeploy after adding variables

### Issue: "EAUTH" or "Authentication failed"

**Cause:** Wrong password or Gmail blocking

**Fix:**
1. Use App-Specific Password (see Step 3)
2. Don't use your regular Gmail password
3. Make sure 2-Step Verification is enabled

### Issue: "ECONNREFUSED" or "Connection timeout"

**Cause:** Gmail blocking Railway server IPs

**Fix:**
1. Verify EMAIL_HOST is `smtp.gmail.com`
2. Verify EMAIL_PORT is `587`
3. Try App-Specific Password
4. If still failing, consider switching to SendGrid (see below)

### Issue: Email takes too long or times out

**Cause:** Network issues between Railway and Gmail

**Fix:**
- Railway might be having connectivity issues with Gmail
- Consider using SendGrid instead (more reliable for production)

## 🎯 Alternative Solution: Use SendGrid (Recommended for Production)

If Gmail continues to have problems, use SendGrid:

### Why SendGrid?
- ✅ More reliable for production
- ✅ Better deliverability
- ✅ No IP blocking issues
- ✅ Free tier: 100 emails/day
- ✅ Professional solution

### Quick SendGrid Setup:

1. Sign up: **https://sendgrid.com/**
2. Verify your email
3. Create an API key:
   - Settings → API Keys → Create API Key
   - Select "Full Access"
   - Copy the API key
4. Update Railway Variables:
   ```
   SENDGRID_API_KEY=your_api_key_here
   EMAIL_FROM=noreply@sewanagalasugar.lk
   ```
5. Let me know - I can update the code to use SendGrid

## 📋 Quick Checklist

Before testing, make sure:

- [ ] Railway project is accessible
- [ ] All 4 EMAIL_* variables added to Railway
- [ ] Gmail App-Specific Password generated
- [ ] EMAIL_APP_PASSWORD updated with App Password
- [ ] Railway has completed redeployment
- [ ] Test endpoint is accessible

## 🎉 Success Indicators

You'll know it's working when:

1. ✅ Test endpoint returns `"success": true`
2. ✅ Test email arrives in your inbox
3. ✅ Bookings send confirmation emails automatically
4. ✅ Railway logs show: "Email sent successfully to..."

## 📞 Still Having Issues?

### Check These:

1. **Railway Logs** - Most important for debugging
   - Deployments → Latest → Logs
   - Look for email errors

2. **Test Endpoint** - Shows detailed diagnostics
   - https://sewanagala-sugar-tour-production.up.railway.app/test-email

3. **Gmail Security Settings**
   - Make sure you're using App Password
   - Check if Gmail sent you security alerts

4. **Railway Variables** - Verify they're set correctly
   - No extra spaces
   - Correct spelling
   - Case-sensitive

### Need More Help?

See these detailed guides:
- `RAILWAY_ENV_SETUP.md` - Step-by-step Railway setup
- `EMAIL_FIX_DEPLOYMENT.md` - Complete troubleshooting
- `EMAIL_FIX_SUMMARY.md` - Quick overview

---

## 📝 Summary

**Problem:** Email not working on Railway
**Root Cause:** Missing environment variables
**Solution:** Add EMAIL_* variables to Railway dashboard
**Critical:** Use Gmail App-Specific Password
**Test:** Visit /test-email endpoint

**Time to fix:** 5-10 minutes
**Difficulty:** Easy (just configuration, no coding)

---

**Start here:** Go to Railway dashboard and add the environment variables! 🚀
