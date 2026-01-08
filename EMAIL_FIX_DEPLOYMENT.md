# Email Service Fix for Railway/Vercel Deployment

## Problem Identified

The email service is not working in production because:

1. **Missing Environment Variables** - Railway/Vercel doesn't have the email configuration from `.env.local`
2. **Hardcoded Credentials** - The email service has fallback hardcoded credentials which may not work in production
3. **Gmail SMTP Restrictions** - Gmail may block connections from cloud servers

## Solution

### Option 1: Configure Environment Variables in Railway (Recommended)

#### Step 1: Add Environment Variables to Railway

Go to your Railway project settings and add these variables:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tharindulalanath49@gmail.com
EMAIL_APP_PASSWORD=pekn uqhy kklc ltjh
```

#### Step 2: Enable Less Secure App Access for Gmail

If using Gmail:
1. Go to Google Account settings
2. Security → 2-Step Verification (enable if not enabled)
3. Generate an **App Password** specifically for this application
4. Use that App Password in `EMAIL_APP_PASSWORD`

#### Step 3: Redeploy

After adding environment variables, redeploy your Railway application.

### Option 2: Use a Production Email Service (Best for Production)

Instead of Gmail, use a dedicated email service:

#### Using SendGrid (Free tier available)

1. **Sign up for SendGrid**: https://sendgrid.com/
2. **Get API Key**: Create an API key from settings
3. **Update emailService.ts** to use SendGrid
4. **Set environment variables**:
```env
SENDGRID_API_KEY=your_sendgrid_api_key
EMAIL_FROM=noreply@sewanagalasugar.lk
```

#### Using Resend (Modern alternative)

1. **Sign up for Resend**: https://resend.com/
2. **Get API Key**: Create an API key
3. **Update emailService.ts** to use Resend
4. **Set environment variables**:
```env
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=noreply@sewanagalasugar.lk
```

### Option 3: Make Email Service More Resilient

Update the email service to handle failures gracefully without breaking bookings.

## Quick Fix for Railway

### 1. Set Environment Variables

In Railway Dashboard:
1. Go to your project
2. Click "Variables" tab
3. Add these variables:

| Variable Name | Value |
|--------------|-------|
| `EMAIL_HOST` | `smtp.gmail.com` |
| `EMAIL_PORT` | `587` |
| `EMAIL_USER` | `tharindulalanath49@gmail.com` |
| `EMAIL_APP_PASSWORD` | `pekn uqhy kklc ltjh` |

### 2. Verify Email Connection

Visit: `https://sewanagala-sugar-tour-production.up.railway.app/test-email`

This will test if the email service is configured correctly.

### 3. Check Logs

In Railway dashboard:
1. Go to "Deployments"
2. Click on latest deployment
3. View logs to see email errors

Common errors:
- `ECONNREFUSED` - Wrong host/port or firewall blocking
- `Authentication failed` - Wrong credentials
- `535 5.7.8` - Gmail blocking less secure apps

## Testing Email Locally vs Production

### Local (.env.local)
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tharindulalanath49@gmail.com
EMAIL_APP_PASSWORD=pekn uqhy kklc ltjh
```

### Railway (Environment Variables)
Same variables, but set in Railway dashboard, NOT in `.env.local`

### Vercel (Environment Variables)
Same variables, but set in Vercel dashboard under Project Settings → Environment Variables

## Alternative: Use Gmail with Railway Public IP

Gmail may block cloud providers. Solutions:

1. **Use App-Specific Password** (recommended)
   - Enable 2FA on Gmail
   - Generate App Password
   - Use that instead of regular password

2. **Whitelist Railway IPs**
   - Not always possible with shared cloud infrastructure

3. **Use SMTP relay service**
   - SendGrid SMTP Relay
   - Mailgun SMTP
   - AWS SES

## Recommended: Switch to SendGrid

### Why SendGrid?
- ✅ Free tier: 100 emails/day
- ✅ Better deliverability
- ✅ No IP blocking issues
- ✅ Better for production
- ✅ Detailed analytics

### Implementation (see files created)

I'll create an updated email service that uses SendGrid as fallback.

## Environment Variables Checklist

Make sure these are set in Railway:

- [x] `DB_HOST`
- [x] `DB_USER`
- [x] `DB_PASSWORD`
- [x] `DB_NAME`
- [x] `JWT_SECRET`
- [ ] `EMAIL_HOST`
- [ ] `EMAIL_PORT`
- [ ] `EMAIL_USER`
- [ ] `EMAIL_APP_PASSWORD`
- [x] `CLOUDINARY_CLOUD_NAME`
- [x] `CLOUDINARY_API_KEY`
- [x] `CLOUDINARY_API_SECRET`

## Next Steps

1. **Immediate Fix**: Add email environment variables to Railway
2. **Test**: Visit `/test-email` endpoint to verify
3. **Monitor**: Check Railway logs for email errors
4. **Consider**: Switching to SendGrid for production reliability

## Support

If issues persist, check:
- Railway deployment logs
- Email server connection from Railway
- Gmail account settings
- App password validity
