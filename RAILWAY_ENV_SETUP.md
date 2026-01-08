# Railway Environment Variables Setup

## Current Deployment Issue: Email Service Not Working

Your application is deployed at: https://sewanagala-sugar-tour-production.up.railway.app/

The email service is not working because Railway doesn't have the email configuration environment variables.

## Step-by-Step Fix

### 1. Access Railway Dashboard

1. Go to https://railway.app/
2. Log in to your account
3. Select your project: "sewanagala-sugar-tour-production"

### 2. Add Environment Variables

Click on your service → **Variables** tab → **RAW Editor**

Add these variables (copy and paste):

```env
# Email Configuration for Gmail
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tharindulalanath49@gmail.com
EMAIL_APP_PASSWORD=pekn uqhy kklc ltjh

# SMS Configuration (if using)
NOTIFY_USER_ID=30646
NOTIFY_API_KEY=l8H0miN4hXIfe7c2BAlz
NOTIFY_SENDER_ID=NotifyDEMO
```

### 3. Important: Gmail Security Settings

⚠️ **Gmail may block the connection from Railway servers**

To fix this:

#### Option A: Use App-Specific Password (Recommended)

1. Go to https://myaccount.google.com/security
2. Enable **2-Step Verification** if not enabled
3. Go to **App passwords** (search for it)
4. Generate a new app password for "Mail"
5. Copy the 16-character password
6. Update `EMAIL_APP_PASSWORD` in Railway with this new password

#### Option B: Enable Less Secure App Access (Not Recommended)

1. Go to https://myaccount.google.com/lesssecureapps
2. Turn on "Allow less secure apps"
3. Note: This is less secure and Google may disable this option

### 4. Verify Environment Variables are Set

In Railway dashboard, check that these variables show up:

- ✅ `EMAIL_HOST` = smtp.gmail.com
- ✅ `EMAIL_PORT` = 587
- ✅ `EMAIL_USER` = tharindulalanath49@gmail.com
- ✅ `EMAIL_APP_PASSWORD` = (your app password)

### 5. Redeploy (Automatic)

Railway will automatically redeploy after you save environment variables.

Wait for the deployment to complete (check the "Deployments" tab).

### 6. Test Email Service

Visit this URL to test if email is working:

```
https://sewanagala-sugar-tour-production.up.railway.app/test-email
```

You should see:
- ✅ "Email server is ready" if working
- ❌ Error message with troubleshooting steps if not working

### 7. Test Booking with Email

1. Go to https://sewanagala-sugar-tour-production.up.railway.app/booking
2. Make a test booking
3. Check if confirmation email arrives

## Alternative: Use SendGrid (Production-Ready)

If Gmail continues to have issues, switch to SendGrid:

### SendGrid Setup

1. Sign up at https://sendgrid.com/ (100 emails/day free)
2. Create an API key
3. Update Railway environment variables:

```env
# Remove Gmail settings, add SendGrid
SENDGRID_API_KEY=your_sendgrid_api_key
EMAIL_FROM=noreply@sewanagalasugar.lk
```

4. Update code to use SendGrid (I can help with this)

## Troubleshooting

### Email Not Sending?

Check Railway logs:
1. Go to Railway dashboard
2. Click on your service
3. View "Logs" tab
4. Look for email-related errors

Common errors:

#### `ECONNREFUSED` 
- Railway server can't connect to Gmail SMTP
- Check if `EMAIL_HOST` and `EMAIL_PORT` are correct
- Gmail might be blocking Railway IPs

#### `EAUTH` or `535 Authentication failed`
- Wrong credentials
- Use App-Specific Password (not regular Gmail password)

#### `Connection timeout`
- Gmail is blocking the connection
- Consider switching to SendGrid

### Check Current Environment Variables

In Railway dashboard, you can see all set variables under the "Variables" tab.

### View Deployment Logs

```
Railway Dashboard → Your Service → Deployments → Latest → Logs
```

Look for:
- ✅ "Email transporter created successfully"
- ❌ "Email service not configured"
- ❌ "Email server connection failed"

## For Vercel Deployment

If you're also using Vercel, add the same environment variables:

1. Go to https://vercel.com/
2. Select your project
3. Settings → Environment Variables
4. Add the same EMAIL_* variables

## Complete Environment Variables List

Here's the complete list for Railway:

```env
# Database
DB_HOST=your_db_host
DB_PORT=3306
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=sewanagala_sugar_tour

# JWT
JWT_SECRET=your_jwt_secret_here_change_in_production

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tharindulalanath49@gmail.com
EMAIL_APP_PASSWORD=your_app_specific_password

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=djy8hclco
CLOUDINARY_CLOUD_NAME=djy8hclco
CLOUDINARY_API_KEY=172476961585941
CLOUDINARY_API_SECRET=RvvWZi0R2acj0AanEQmqc5iZ-qM

# SMS (Optional)
NOTIFY_USER_ID=30646
NOTIFY_API_KEY=l8H0miN4hXIfe7c2BAlz
NOTIFY_SENDER_ID=NotifyDEMO

# Next.js
NEXT_PUBLIC_API_URL=https://sewanagala-sugar-tour-production.up.railway.app
NODE_ENV=production
```

## Next Steps After Fix

1. ✅ Add environment variables to Railway
2. ✅ Wait for automatic redeploy
3. ✅ Test email at `/test-email` endpoint
4. ✅ Make a test booking
5. ✅ Verify email arrives
6. ✅ Monitor Railway logs for any errors

## Need Help?

If you continue to have issues:
1. Check Railway deployment logs
2. Visit the `/test-email` page for detailed diagnostics
3. Consider switching to SendGrid for better reliability
